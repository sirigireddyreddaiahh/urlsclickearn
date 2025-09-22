// server/utils/users-file.ts

import * as bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'

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
  verified?: boolean
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
  createdAt?: string
  updatedAt?: string
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
  createdAt?: string
  lastActivity: string
}

export interface LoginAttemptRecord {
  email: string
  ipAddress: string
  success: boolean
  timestamp: string
  userAgent?: string
}

// KV keys
const USERS_KEY = 'users'
const SESSIONS_KEY = 'sessions'
const LOGIN_ATTEMPTS_KEY = 'login_attempts'

function getKV() {
  // Nitro/Cloudflare: global KV binding
  // Provide a simple in-memory fallback for local development when KV or useStorage is not available.
  const maybeKV = (globalThis as any).KV
  if (maybeKV)
    return maybeKV

  try {
    // useStorage is provided by Nitro at runtime — try to use it if present
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (globalThis as any).useStorage ? (globalThis as any).useStorage('kv') : undefined
  }
  catch (e) {
    // fall through to in-memory
  }

  // In-memory fallback
  if (!(globalThis as any).__DEV_KV_STORE) {
    (globalThis as any).__DEV_KV_STORE = new Map<string, string>()
    ;(globalThis as any).__DEV_KV_STORE.get = function (key: string) {
      return Promise.resolve((globalThis as any).__DEV_KV_STORE.has(key) ? (globalThis as any).__DEV_KV_STORE.get(key) : undefined)
    }
    ;(globalThis as any).__DEV_KV_STORE.put = function (key: string, value: string) {
      (globalThis as any).__DEV_KV_STORE.set(key, value)
      return Promise.resolve()
    }
  }

  return (globalThis as any).__DEV_KV_STORE
}

class UserManagementSystem {
  private lockoutThreshold: number = 5
  private lockoutDuration: number = 30 * 60 * 1000 // 30 minutes
  private sessionDuration: number = 7 * 24 * 60 * 60 * 1000 // 7 days
  private passwordHistoryLimit: number = 5

  // User Management Methods
  async readUsers(): Promise<UserRecord[]> {
    const kv = getKV()
    const raw = await kv.get(USERS_KEY)
    return JSON.parse(raw || '[]')
  }

  async writeUsers(users: UserRecord[]): Promise<void> {
    const kv = getKV()
    await kv.put(USERS_KEY, JSON.stringify(users, null, 2))
  }

  async findUserByEmail(email: string): Promise<UserRecord | null> {
    const users = await this.readUsers()
    return users.find(u =>
      u.email.toLowerCase() === email.toLowerCase()
      && u.status !== 'deleted',
    ) || null
  }

  async findUserById(id: string): Promise<UserRecord | null> {
    const users = await this.readUsers()
    return users.find(u => u.id === id && u.status !== 'deleted') || null
  }

  async createUser(
    email: string,
    passwordHash: string,
    profile?: Partial<UserProfile>,
  ): Promise<UserRecord> {
    const users = await this.readUsers()
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase())

    if (existing) {
      throw new Error('User with this email already exists')
    }

    const now = new Date().toISOString()
    const user: UserRecord = {
      id: nanoid(),
      email: email.toLowerCase(),
      passwordHash,
      verified: false,
      profile: profile || {},
      settings: {
        emailNotifications: true,
        twoFactorEnabled: false,
        marketingEmails: false,
        loginAlerts: true,
      },
      role: 'user',
      status: 'active',
      loginCount: 0,
      failedLoginAttempts: 0,
      createdAt: now,
      updatedAt: now,
      metadata: {},
    }

    users.push(user)
    await this.writeUsers(users)
    return user
  }

  async updateUser(
    identifier: { id?: string, email?: string },
    updates: Partial<UserRecord>,
  ): Promise<UserRecord> {
    const users = await this.readUsers()
    const idx = users.findIndex(u =>
      (identifier.id && u.id === identifier.id)
      || (identifier.email && u.email.toLowerCase() === identifier.email.toLowerCase()),
    )

    if (idx === -1) {
      throw new Error('User not found')
    }

    const updatedUser = {
      ...users[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    // Ensure id remains a string
    if (!updatedUser.id)
      updatedUser.id = users[idx]!.id || nanoid()

    users[idx] = updatedUser as UserRecord
    await this.writeUsers(users)
    return updatedUser as UserRecord
  }

  async deleteUser(id: string, permanent: boolean = false): Promise<void> {
    const users = await this.readUsers()

    if (permanent) {
      const filtered = users.filter(u => u.id !== id)
      await this.writeUsers(filtered)
    }
    else {
      const idx = users.findIndex(u => u.id === id)
      if (idx !== -1) {
        users[idx] = {
          ...users[idx],
          id: users[idx]!.id || nanoid(),
          status: 'deleted',
          deletedAt: new Date().toISOString(),
        } as UserRecord
        await this.writeUsers(users)
      }
    }
  }

  // Authentication Methods
  async validatePassword(password: string): Promise<{ valid: boolean, errors: string[] }> {
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
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }

    return { valid: errors.length === 0, errors }
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
    const kv = getKV()
    const raw = await kv.get(SESSIONS_KEY)
    return JSON.parse(raw || '[]')
  }

  async writeSessions(sessions: SessionRecord[]): Promise<void> {
    const kv = getKV()
    await kv.put(SESSIONS_KEY, JSON.stringify(sessions, null, 2))
  }

  async createSession(
    userId: string,
    token: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<SessionRecord> {
    const sessions = await this.readSessions()
    const now = new Date().toISOString()

    const session: SessionRecord = {
      id: nanoid(),
      userId,
      token,
      ipAddress,
      userAgent,
      expiresAt: new Date(Date.now() + this.sessionDuration).toISOString(),
      createdAt: now,
      lastActivity: now,
    }

    sessions.push(session)
    await this.writeSessions(sessions)
    return session
  }

  async validateSession(token: string): Promise<SessionRecord | null> {
    const sessions = await this.readSessions()
    const session = sessions.find(s => s.token === token)

    if (!session)
      return null

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
    userAgent?: string,
  ): Promise<void> {
    const kv = getKV()
    const attempts = JSON.parse((await kv.get(LOGIN_ATTEMPTS_KEY)) || '[]')

    attempts.push({
      email: email.toLowerCase(),
      success,
      ipAddress,
      userAgent,
      timestamp: new Date().toISOString(),
    })

    // Keep only last 1000 attempts
    if (attempts.length > 1000) {
      attempts.splice(0, attempts.length - 1000)
    }

    await kv.put(LOGIN_ATTEMPTS_KEY, JSON.stringify(attempts, null, 2))

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
    if (!user || !user.lockedUntil)
      return false

    if (new Date(user.lockedUntil) > new Date()) {
      return true
    }

    // Unlock if time has passed
    await this.updateUser({ email }, {
      lockedUntil: undefined,
      failedLoginAttempts: 0,
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
        user: users.filter(u => u.role === 'user').length,
      },
    }
  }

  async cleanupExpiredData(): Promise<void> {
    const kv = getKV()
    // Clean expired sessions
    const sessions = await this.readSessions()
    const validSessions = sessions.filter(s => new Date(s.expiresAt) > new Date())
    await this.writeSessions(validSessions)
    // Clean old login attempts (keep last 30 days)
    const attempts = JSON.parse((await kv.get(LOGIN_ATTEMPTS_KEY)) || '[]')
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentAttempts = attempts.filter((a: LoginAttemptRecord) =>
      new Date(a.timestamp) > thirtyDaysAgo,
    )
    await kv.put(LOGIN_ATTEMPTS_KEY, JSON.stringify(recentAttempts, null, 2))
  }
}

// Export singleton instance
export const userManagement = new UserManagementSystem()

// Export convenience functions for backward compatibility
export const readUsers = () => userManagement.readUsers()
export const writeUsers = (users: UserRecord[]) => userManagement.writeUsers(users)
export const findUserByEmail = (email: string) => userManagement.findUserByEmail(email)
export const findUserById = (id: string) => userManagement.findUserById(id)
export function createUser(email: string, passwordHash: string, profile?: Partial<UserProfile>) {
  return userManagement.createUser(email, passwordHash, profile)
}
export function updateUser(identifier: any, updates: Partial<UserRecord>) {
  return userManagement.updateUser(identifier, updates)
}
export const validatePassword = userManagement.validatePassword.bind(userManagement)
