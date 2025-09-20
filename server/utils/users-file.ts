// server/utils/users-file.ts
import fs from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import bcrypt from 'bcryptjs'

const DATA_DIR = path.join(process.cwd(), 'server', 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json')
const LOGIN_ATTEMPTS_FILE = path.join(DATA_DIR, 'login_attempts.json')

export interface UserProfile {
  firstName?: string
  lastName?: string
  phone?: string
  country?: string
  timezone?: string
  language?: string
  avatar?: string
}

export interface UserSettings {
  emailNotifications?: boolean
  twoFactorEnabled?: boolean
  marketingEmails?: boolean
  loginAlerts?: boolean
}

export interface UserRecord {
  id: string
  email: string
  passwordHash: string
  verified: boolean
  verificationCode?: string
  verificationExpiresAt?: string
  resetCode?: string
  resetExpiresAt?: string
  profile?: UserProfile
  settings?: UserSettings
  role: 'user' | 'admin' | 'moderator'
  status: 'active' | 'suspended' | 'deleted'
  lastLogin?: string
  lastLoginIp?: string
  loginCount: number
  failedLoginAttempts: number
  lockedUntil?: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
  metadata?: Record<string, any>
}

export interface SessionRecord {
  id: string
  userId: string
  token: string
  ipAddress?: string
  userAgent?: string
  expiresAt: string
  createdAt: string
  lastActivity: string
}

export interface LoginAttemptRecord {
  email: string
  ipAddress: string
  success: boolean
  timestamp: string
  userAgent?: string
}

class UserManagementSystem {
  private lockoutThreshold: number = 5
  private lockoutDuration: number = 30 * 60 * 1000 // 30 minutes
  private sessionDuration: number = 7 * 24 * 60 * 60 * 1000 // 7 days
  private passwordHistoryLimit: number = 5

  async ensureDataFiles(): Promise<void> {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true })
      
      // Ensure all data files exist
      const files = [
        { path: USERS_FILE, default: '[]' },
        { path: SESSIONS_FILE, default: '[]' },
        { path: LOGIN_ATTEMPTS_FILE, default: '[]' }
      ]
      
      for (const file of files) {
        try {
          await fs.access(file.path)
        } catch {
          await fs.writeFile(file.path, file.default, 'utf8')
        }
      }
    } catch (error) {
      console.error('Failed to ensure data files:', error)
      throw error
    }
  }

  // User Management Methods
  async readUsers(): Promise<UserRecord[]> {
    await this.ensureDataFiles()
    const raw = await fs.readFile(USERS_FILE, 'utf8')
    return JSON.parse(raw || '[]')
  }

  async writeUsers(users: UserRecord[]): Promise<void> {
    await this.ensureDataFiles()
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8')
  }

  async findUserByEmail(email: string): Promise<UserRecord | null> {
    const users = await this.readUsers()
    return users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.status !== 'deleted'
    ) || null
  }

  async findUserById(id: string): Promise<UserRecord | null> {
    const users = await this.readUsers()
    return users.find(u => u.id === id && u.status !== 'deleted') || null
  }

  async createUser(
    email: string, 
    passwordHash: string, 
    profile?: Partial<UserProfile>
  ): Promise<UserRecord> {
    const users = await this.readUsers()
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    
    if (existing) {
      throw new Error('User with this email already exists')
    }

    const now = new Date().toISOString()
    const user: UserRecord = {
      id: randomUUID(),
      email: email.toLowerCase(),
      passwordHash,
      verified: false,
      profile: profile || {},
      settings: {
        emailNotifications: true,
        twoFactorEnabled: false,
        marketingEmails: false,
        loginAlerts: true
      },
      role: 'user',
      status: 'active',
      loginCount: 0,
      failedLoginAttempts: 0,
      createdAt: now,
      updatedAt: now,
      metadata: {}
    }

    users.push(user)
    await this.writeUsers(users)
    return user
  }

  async updateUser(
    identifier: { id?: string; email?: string },
    updates: Partial<UserRecord>
  ): Promise<UserRecord> {
    const users = await this.readUsers()
    const idx = users.findIndex(u => 
      (identifier.id && u.id === identifier.id) || 
      (identifier.email && u.email.toLowerCase() === identifier.email.toLowerCase())
    )
    
    if (idx === -1) {
      throw new Error('User not found')
    }

    const updatedUser = {
      ...users[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    users[idx] = updatedUser
    await this.writeUsers(users)
    return updatedUser
  }

  async deleteUser(id: string, permanent: boolean = false): Promise<void> {
    const users = await this.readUsers()
    
    if (permanent) {
      const filtered = users.filter(u => u.id !== id)
      await this.writeUsers(filtered)
    } else {
      const idx = users.findIndex(u => u.id === id)
      if (idx !== -1) {
        users[idx] = {
          ...users[idx],
          status: 'deleted',
          deletedAt: new Date().toISOString()
        }
        await this.writeUsers(users)
      }
    }
  }

  // Authentication Methods
  async validatePassword(password: string): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = []
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number')
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }
    
    // Check for common patterns
    const commonPatterns = ['123456', 'password', 'qwerty', 'abc123', '111111']
    if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
      errors.push('Password contains common patterns that are easily guessable')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12)
    return bcrypt.hash(password, salt)
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  // Session Management
  async readSessions(): Promise<SessionRecord[]> {
    await this.ensureDataFiles()
    const raw = await fs.readFile(SESSIONS_FILE, 'utf8')
    return JSON.parse(raw || '[]')
  }

  async writeSessions(sessions: SessionRecord[]): Promise<void> {
    await this.ensureDataFiles()
    await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf8')
  }

  async createSession(
    userId: string, 
    token: string, 
    ipAddress?: string, 
    userAgent?: string
  ): Promise<SessionRecord> {
    const sessions = await this.readSessions()
    const now = new Date().toISOString()
    
    const session: SessionRecord = {
      id: randomUUID(),
      userId,
      token,
      ipAddress,
      userAgent,
      expiresAt: new Date(Date.now() + this.sessionDuration).toISOString(),
      createdAt: now,
      lastActivity: now
    }
    
    sessions.push(session)
    await this.writeSessions(sessions)
    return session
  }

  async validateSession(token: string): Promise<SessionRecord | null> {
    const sessions = await this.readSessions()
    const session = sessions.find(s => s.token === token)
    
    if (!session) return null
    
    if (new Date(session.expiresAt) < new Date()) {
      // Session expired, remove it
      await this.removeSession(token)
      return null
    }
    
    // Update last activity
    session.lastActivity = new Date().toISOString()
    await this.writeSessions(sessions)
    
    return session
  }

  async removeSession(token: string): Promise<void> {
    const sessions = await this.readSessions()
    const filtered = sessions.filter(s => s.token !== token)
    await this.writeSessions(filtered)
  }

  async removeUserSessions(userId: string): Promise<void> {
    const sessions = await this.readSessions()
    const filtered = sessions.filter(s => s.userId !== userId)
    await this.writeSessions(filtered)
  }

  // Login Attempt Tracking
  async recordLoginAttempt(
    email: string, 
    success: boolean, 
    ipAddress: string, 
    userAgent?: string
  ): Promise<void> {
    await this.ensureDataFiles()
    const attempts = JSON.parse(await fs.readFile(LOGIN_ATTEMPTS_FILE, 'utf8') || '[]')
    
    attempts.push({
      email: email.toLowerCase(),
      success,
      ipAddress,
      userAgent,
      timestamp: new Date().toISOString()
    })
    
    // Keep only last 1000 attempts
    if (attempts.length > 1000) {
      attempts.splice(0, attempts.length - 1000)
    }
    
    await fs.writeFile(LOGIN_ATTEMPTS_FILE, JSON.stringify(attempts, null, 2), 'utf8')
    
    // Update user's failed attempts count
    if (!success) {
      const user = await this.findUserByEmail(email)
      if (user) {
        const failedAttempts = user.failedLoginAttempts + 1
        const updates: Partial<UserRecord> = { failedLoginAttempts: failedAttempts }
        
        if (failedAttempts >= this.lockoutThreshold) {
          updates.lockedUntil = new Date(Date.now() + this.lockoutDuration).toISOString()
        }
        
        await this.updateUser({ email }, updates)
      }
    }
  }

  async checkAccountLocked(email: string): Promise<boolean> {
    const user = await this.findUserByEmail(email)
    if (!user || !user.lockedUntil) return false
    
    if (new Date(user.lockedUntil) > new Date()) {
      return true
    }
    
    // Unlock if time has passed
    await this.updateUser({ email }, { 
      lockedUntil: undefined, 
      failedLoginAttempts: 0 
    })
    
    return false
  }

  // Statistics and Admin Functions
  async getUserStatistics(): Promise<any> {
    const users = await this.readUsers()
    const sessions = await this.readSessions()
    
    return {
      totalUsers: users.filter(u => u.status !== 'deleted').length,
      verifiedUsers: users.filter(u => u.verified && u.status === 'active').length,
      activeUsers: users.filter(u => u.status === 'active').length,
      suspendedUsers: users.filter(u => u.status === 'suspended').length,
      deletedUsers: users.filter(u => u.status === 'deleted').length,
      activeSessions: sessions.filter(s => new Date(s.expiresAt) > new Date()).length,
      usersByRole: {
        admin: users.filter(u => u.role === 'admin').length,
        moderator: users.filter(u => u.role === 'moderator').length,
        user: users.filter(u => u.role === 'user').length
      }
    }
  }

  async cleanupExpiredData(): Promise<void> {
    // Clean expired sessions
    const sessions = await this.readSessions()
    const validSessions = sessions.filter(s => new Date(s.expiresAt) > new Date())
    await this.writeSessions(validSessions)
    
    // Clean old login attempts (keep last 30 days)
    const attempts = JSON.parse(await fs.readFile(LOGIN_ATTEMPTS_FILE, 'utf8') || '[]')
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentAttempts = attempts.filter((a: LoginAttemptRecord) => 
      new Date(a.timestamp) > thirtyDaysAgo
    )
    await fs.writeFile(LOGIN_ATTEMPTS_FILE, JSON.stringify(recentAttempts, null, 2), 'utf8')
  }
}

// Export singleton instance
export const userManagement = new UserManagementSystem()

// Export convenience functions for backward compatibility
export const readUsers = () => userManagement.readUsers()
export const writeUsers = (users: UserRecord[]) => userManagement.writeUsers(users)
export const findUserByEmail = (email: string) => userManagement.findUserByEmail(email)
export const findUserById = (id: string) => userManagement.findUserById(id)
export const createUser = (email: string, passwordHash: string, profile?: Partial<UserProfile>) => 
  userManagement.createUser(email, passwordHash, profile)
export const updateUser = (identifier: any, updates: Partial<UserRecord>) => 
  userManagement.updateUser(identifier, updates)