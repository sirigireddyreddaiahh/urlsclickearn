<template>
  <Header />
  <main>
    <!-- HERO SECTION -->
    <section class="hero-gradient min-h-screen relative overflow-hidden">
      <!-- Animated Background -->
      <div class="absolute inset-0">
        <div class="floating-circle circle-1"></div>
        <div class="floating-circle circle-2"></div>
        <div class="floating-circle circle-3"></div>
      </div>

      <div class="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div class="text-center mb-12 animate-fade-in">
          <h1 class="hero-title">
            <span class="gradient-text">Shorten</span> Your Links,
            <span class="gradient-text">Amplify</span> Your Reach
          </h1>
          <p class="hero-subtitle">
            Transform long URLs into powerful short links with real-time analytics
          </p>
        </div>

        <!-- URL SHORTENER CARD -->
        <div class="glass-card max-w-4xl mx-auto">
          <form @submit.prevent="createShort" class="space-y-6">
            <div class="grid md:grid-cols-3 gap-4">
              <div class="md:col-span-2">
                <label class="form-label">
                  <span class="label-icon">🔗</span>
                  Paste your long URL here
                </label>
                <input 
                  v-model="url" 
                  type="url" 
                  class="form-input" 
                  placeholder="https://example.com/very-long-url-here" 
                  required 
                />
              </div>
              <div>
                <label class="form-label">
                  <span class="label-icon">✨</span>
                  Custom alias (optional)
                </label>
                <input 
                  v-model="slug" 
                  type="text" 
                  class="form-input" 
                  placeholder="my-link" 
                />
              </div>
            </div>

            <div class="flex flex-wrap gap-4 items-center">
              <button type="submit" class="btn-primary group">
                <span>Shorten URL</span>
                <svg class="btn-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </button>
              <NuxtLink to="/dashboard" class="btn-secondary">
                <span class="btn-icon">📊</span>
                Dashboard
              </NuxtLink>
            </div>
          </form>

          <!-- Success Message -->
          <transition name="slide-up">
            <div v-if="message" :class="['alert', messageType === 'success' ? 'alert-success' : 'alert-error']">
              <div class="alert-icon">{{ messageType === 'success' ? '✅' : '⚠️' }}</div>
              <span>{{ message }}</span>
            </div>
          </transition>

          <!-- Shortened URL Result -->
          <transition name="scale-in">
            <div v-if="short" class="result-card">
              <div class="result-header">
                <span class="result-badge">NEW</span>
                <span class="result-title">Your short link is ready!</span>
              </div>
              <div class="result-content">
                <input 
                  ref="shortInput" 
                  :value="short" 
                  readonly 
                  class="result-input"
                  @click="selectAll"
                />
                <button @click="copyShort" class="btn-copy">
                  <span v-if="!copied">Copy</span>
                  <span v-else>Copied!</span>
                </button>
                <button @click="openQR" class="btn-qr">
                  <span>QR</span>
                </button>
              </div>
              <div class="result-actions">
                <button @click="shareLink('twitter')" class="share-btn twitter">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </button>
                <button @click="shareLink('facebook')" class="share-btn facebook">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </button>
                <button @click="shareLink('linkedin')" class="share-btn linkedin">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </button>
              </div>
            </div>
          </transition>
        </div>

        <!-- Quick Stats -->
        <div class="quick-stats">
          <div class="stat-item">
            <span class="stat-number">{{ animatedStats.links }}K+</span>
            <span class="stat-label">Links Created</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ animatedStats.clicks }}M+</span>
            <span class="stat-label">Clicks Tracked</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ animatedStats.users }}K+</span>
            <span class="stat-label">Happy Users</span>
          </div>
        </div>
      </div>
    </section>

    <!-- # Add Section: Native Async Ad Banner Before Features -->
    <section>
      <div id="container-baafe128a08c806c01cbd4b9d77ced82"></div>
    </section>

    <!-- FEATURES SECTION -->
    <section class="features-section">
      <div class="container mx-auto px-4">
        <div class="section-header">
          <span class="section-badge">FEATURES</span>
          <h2 class="section-title">Everything you need to manage links</h2>
          <p class="section-subtitle">Powerful tools to shorten, share, and track your URLs</p>
        </div>

        <div class="features-grid">
          <div class="feature-card group">
            <div class="feature-icon-wrapper">
              <div class="feature-icon">⚡</div>
            </div>
            <h3 class="feature-title">Lightning Fast</h3>
            <p class="feature-desc">Create short links instantly with our optimized infrastructure</p>
            <div class="feature-hover-effect"></div>
          </div>

          <div class="feature-card group">
            <div class="feature-icon-wrapper">
              <div class="feature-icon">📊</div>
            </div>
            <h3 class="feature-title">Real-time Analytics</h3>
            <p class="feature-desc">Track clicks, locations, devices, and more in real-time</p>
            <div class="feature-hover-effect"></div>
          </div>

          <div class="feature-card group">
            <div class="feature-icon-wrapper">
              <div class="feature-icon">🎨</div>
            </div>
            <h3 class="feature-title">Custom Aliases</h3>
            <p class="feature-desc">Create memorable branded short links with custom aliases</p>
            <div class="feature-hover-effect"></div>
          </div>

          <div class="feature-card group">
            <div class="feature-icon-wrapper">
              <div class="feature-icon">📱</div>
            </div>
            <h3 class="feature-title">QR Codes</h3>
            <p class="feature-desc">Generate QR codes for your links instantly</p>
            <div class="feature-hover-effect"></div>
          </div>

          <div class="feature-card group">
            <div class="feature-icon-wrapper">
              <div class="feature-icon">🔒</div>
            </div>
            <h3 class="feature-title">Secure & Reliable</h3>
            <p class="feature-desc">Enterprise-grade security with 99.9% uptime guarantee</p>
            <div class="feature-hover-effect"></div>
          </div>

          <div class="feature-card group">
            <div class="feature-icon-wrapper">
              <div class="feature-icon">🤖</div>
            </div>
            <h3 class="feature-title">AI-Powered</h3>
            <p class="feature-desc">Smart slug suggestions powered by artificial intelligence</p>
            <div class="feature-hover-effect"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- # Add Section: Popunder Ad After Features -->
    <section>
      <div id="popunder-ad-container"></div>
    </section>

    <!-- RECENT LINKS -->
    <section class="recent-section">
      <div class="container mx-auto px-4">
        <div class="section-header">
          <span class="section-badge">TRENDING</span>
          <h2 class="section-title">Recently Created Links</h2>
        </div>

        <div class="links-container">
          <div v-for="(link, idx) in recentList" :key="idx" class="link-card">
            <div class="link-header">
              <a :href="formatShortLink(link)" target="_blank" class="link-short">
                <span class="link-icon">🔗</span>
                {{ shortLinkText(link) }}
              </a>
              <span class="link-badge">{{ formatTime(link.createdAt) }}</span>
            </div>
            <div class="link-original">{{ originalLinkText(link) }}</div>
            <div class="link-stats">
              <span class="stat-item">
                <span class="stat-icon">👁</span>
                {{ formatClicks(link) }}
              </span>
              <span class="stat-item">
                <span class="stat-icon">📍</span>
                {{ link.country || 'Global' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA SECTION -->
    <section class="cta-section">
      <div class="container mx-auto px-4 text-center">
        <h2 class="cta-title">Start shortening links today</h2>
        <p class="cta-subtitle">Join thousands of users who trust us with their links</p>
        <div class="cta-buttons">
          <button @click="scrollToTop" class="btn-primary btn-large">
            Get Started Free
          </button>
          <NuxtLink to="/dashboard" class="btn-secondary btn-large">
            View Dashboard
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- FOOTER AD SPACE -->
    <div class="footer-ad">
      <div class="container mx-auto px-4">
        <div class="ad-wrapper">
          <!-- Footer ad placement -->
          <div class="ad-placeholder-footer">
            Advertisement Space
          </div>
        </div>
      </div>
    </div>
  </main>
  <Footer />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Header from '@/components/layouts/Header.vue';
import Footer from '@/components/layouts/Footer.vue';

const url = ref('')
const slug = ref('')
const short = ref('')
const message = ref('')
const messageType = ref('success')
const recentList = ref([])
const copied = ref(false)
const showAdModal = ref(false)
const adTimer = ref(5)

// Animated stats
const animatedStats = ref({
  links: 0,
  clicks: 0,
  users: 0
})

const formatTime = (timestamp) => {
  if (!timestamp) return 'Just now'
  const date = new Date(timestamp)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)
  
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const shortLinkText = (item) => {
  if (!item) return ''
  if (item?.link?.slug) return item.link.slug
  if (item?.slug) return item.slug
  if (item?.name?.startsWith('link:')) return item.name.replace(/^link:/,'')
  if (item?.key) return item.key
  return ''
}

const formatShortLink = (item) => {
  if (!item) return '#'
  const slug = shortLinkText(item)
  return slug ? `/${slug}` : '#'
}

const originalLinkText = (item) => {
  if (!item) return ''
  if (item?.link?.url) return item.link.url
  if (item?.metadata?.url) return item.metadata.url
  if (item?.original) return item.original
  return item?.url ?? ''
}

const formatClicks = (item) => {
  const c = item?.link?.clicks ?? item?.metadata?.clicks ?? item?.clicks ?? 0
  if (c > 1000) return `${(c/1000).toFixed(1)}k`
  return c.toString()
}

async function createShort() {
  message.value = ''
  short.value = ''
  
  if (!url.value) {
    message.value = 'Please enter a valid URL'
    messageType.value = 'error'
    return
  }
  
  try {
    const body = { url: url.value }
    if (slug.value) body.slug = slug.value
    
    const res = await fetch('/api/link/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    
    if (!res.ok) {
      const error = await res.json()
      message.value = error?.message || 'Failed to create short link'
      messageType.value = 'error'
      return
    }
    
    const data = await res.json()
    short.value = data?.shortLink || `${location.origin}/${data?.link?.slug || data?.slug}`
    message.value = 'Short URL created successfully!'
    messageType.value = 'success'
    url.value = ''
    slug.value = ''
    
    await loadRecent()
  } catch (err) {
    message.value = err?.message || 'Something went wrong'
    messageType.value = 'error'
  }
}

async function loadRecent() {
  try {
    const res = await fetch('/api/link/list?limit=6')
    if (!res.ok) return
    
    const data = await res.json()
    if (Array.isArray(data)) recentList.value = data
    else if (data?.keys) recentList.value = data.keys
    else if (data?.list) recentList.value = data.list
    else recentList.value = []
  } catch(e) {
    recentList.value = []
  }
}

function copyShort() {
  if (!short.value) return
  navigator.clipboard.writeText(short.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

function selectAll(event) {
  event.target.select()
}

function openQR() {
  // QR code generation logic
  window.open(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(short.value)}`, '_blank')
}

function shareLink(platform) {
  const encodedUrl = encodeURIComponent(short.value)
  const urls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=Check out this link!`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  }
  window.open(urls[platform], '_blank', 'width=600,height=400')
}

function skipAd() {
  if (adTimer.value === 0) {
    showAdModal.value = false
    // Redirect to destination
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Animate stats on mount
function animateStats() {
  const targetStats = { links: 500, clicks: 10, users: 50 }
  const duration = 2000
  const steps = 60
  const interval = duration / steps
  
  let currentStep = 0
  const timer = setInterval(() => {
    currentStep++
    const progress = currentStep / steps
    
    animatedStats.value = {
      links: Math.floor(targetStats.links * progress),
      clicks: Math.floor(targetStats.clicks * progress),
      users: Math.floor(targetStats.users * progress)
    }
    
    if (currentStep >= steps) clearInterval(timer)
  }, interval)
}

onMounted(() => {
  loadRecent()
  animateStats()

  // Load Native Async Ad Banner script
  const nativeScript = document.createElement('script');
  nativeScript.async = true;
  nativeScript.setAttribute('data-cfasync', 'false');
  nativeScript.src = '//preferablyending.com/baafe128a08c806c01cbd4b9d77ced82/invoke.js';
  document.getElementById('container-baafe128a08c806c01cbd4b9d77ced82').appendChild(nativeScript);
  console.log('Native Async Ad Banner script loaded.');

  // Load Popunder Ad script
  const popunderScript = document.createElement('script');
  popunderScript.type = 'text/javascript';
  popunderScript.src = '//preferablyending.com/84/38/22/84382233fb94a7cfb87278684808293a.js';
  document.getElementById('popunder-ad-container').appendChild(popunderScript);
  console.log('Popunder Ad script loaded.');

  // Dynamically load the ads script
  const script = document.createElement('script');
  script.src = 'https://example.com/ads.js'; // Replace with the actual ads script URL
  script.async = true;
  document.body.appendChild(script);

  // Dynamically load the Anti-Adblock JS script
  const antiAdblockScript = document.createElement('script');
  antiAdblockScript.src = '//preferablyending.com/84/38/22/84382233fb94a7cfb87278684808293a.js';
  antiAdblockScript.async = true;
  document.body.appendChild(antiAdblockScript);
})
</script>

<style scoped>
/* Global Styles */
* {
  box-sizing: border-box;
}

/* Hero Section */
.hero-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #fda085 100%);
  position: relative;
}

.floating-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 20s infinite ease-in-out;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  left: -150px;
  animation-delay: 0s;
}

.circle-2 {
  width: 400px;
  height: 400px;
  bottom: -200px;
  right: -200px;
  animation-delay: 5s;
}

.circle-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  left: 50%;
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(30px, -30px) rotate(90deg); }
  50% { transform: translate(-20px, 20px) rotate(180deg); }
  75% { transform: translate(40px, 10px) rotate(270deg); }
}

.hero-title {
  font-size: 4rem;
  font-weight: 900;
  color: white;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.gradient-text {
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% { filter: hue-rotate(0deg); }
  50% { filter: hue-rotate(30deg); }
}

.hero-subtitle {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 400;
  max-width: 600px;
  margin: 0 auto;
}

/* Glass Card */
.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Form Styles */
.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.label-icon {
  font-size: 1rem;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

/* Buttons */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(102, 126, 234, 0.5);
}

.btn-arrow {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.btn-primary:hover .btn-arrow {
  transform: translateX(4px);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: #667eea;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  border: 2px solid #667eea;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.btn-icon {
  font-size: 1.2rem;
}

/* Alert Messages */
.alert {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-top: 1.5rem;
  animation: slideUp 0.3s ease;
}

.alert-success {
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
  color: #0c5460;
}

.alert-error {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.alert-icon {
  font-size: 1.5rem;
}

@keyframes slideUp {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Result Card */
.result-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 1.5rem;
  margin-top: 1.5rem;
  color: white;
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.result-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.result-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.result-title {
  font-weight: 600;
}

.result-content {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.result-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
}

.result-input::selection {
  background: rgba(255, 255, 255, 0.3);
}

.btn-copy, .btn-qr {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-copy:hover, .btn-qr:hover {
/* Continuing from .result-input::selection */
  background: rgba(255, 255, 255, 0.3);
}

.btn-copy, .btn-qr {
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-copy:hover, .btn-qr:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.result-actions {
  display: flex;
  gap: 0.5rem;
}

.share-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}

.share-btn.twitter {
  background: #1DA1F2;
}

.share-btn.facebook {
  background: #1877F2;
}

.share-btn.linkedin {
  background: #0A66C2;
}

.share-btn:hover {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

/* Quick Stats */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 600px;
  margin: 3rem auto 0;
}

.stat-item {
  text-align: center;
  color: white;
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
  animation: countUp 2s ease;
}

@keyframes countUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.95;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Ad Modal */
.ad-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.ad-modal {
  background: white;
  border-radius: 20px;
  max-width: 800px;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ad-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ad-title {
  font-size: 1.25rem;
  font-weight: 600;
}

.ad-timer {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  position: relative;
}

.timer-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: #ffd700;
  border-radius: 3px;
  transition: width 1s linear;
}

.ad-content {
  padding: 2rem;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ad-placeholder {
  width: 100%;
  height: 300px;
  background: #f7fafc;
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a0aec0;
  font-size: 1.125rem;
}

.btn-skip {
  width: 100%;
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
  color: #0c5460;
  padding: 1.25rem;
  border: none;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-skip:hover {
  background: linear-gradient(135deg, #8fd3f4 0%, #84fab0 100%);
  transform: translateY(-2px);
}

/* Features Section */
.features-section {
  padding: 5rem 0;
  background: #f8fafc;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-badge {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 3rem;
  font-weight: 900;
  color: #1a202c;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.section-subtitle {
  font-size: 1.25rem;
  color: #718096;
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.feature-icon-wrapper {
  position: relative;
  width: 60px;
  height: 60px;
  margin-bottom: 1.5rem;
}

.feature-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(5deg);
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1rem;
}

.feature-desc {
  font-size: 1rem;
  color: #718096;
  line-height: 1.7;
}

.feature-hover-effect {
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.feature-card:hover .feature-hover-effect {
  opacity: 1;
}

/* Recent Links Section */
.recent-section {
  padding: 5rem 0;
  background: white;
}

.links-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.link-card {
  background: #f8fafc;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.link-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.link-card:hover::before {
  transform: translateX(0);
}

.link-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  background: white;
}

.link-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.link-short {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: color 0.3s ease;
}

.link-short:hover {
  color: #764ba2;
}

.link-icon {
  font-size: 1.2rem;
}

.link-badge {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.link-original {
  color: #718096;
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 1rem;
}

.link-stats {
  display: flex;
  gap: 1.5rem;
}

.link-stats .stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
  font-size: 0.875rem;
}

.stat-icon {
  font-size: 1rem;
}

/* CTA Section */
.cta-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.cta-section::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  top: -250px;
  right: -250px;
  animation: float 15s infinite ease-in-out;
}

.cta-title {
  font-size: 3rem;
  font-weight: 900;
  color: white;
  margin-bottom: 1rem;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.cta-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-buttons .btn-primary {
  background: white;
  color: #667eea;
}

.cta-buttons .btn-primary:hover {
  background: #f8fafc;
}

.cta-buttons .btn-secondary {
  background: transparent;
  border-color: white;
  color: white;
}

.cta-buttons .btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
  color: white;
}

/* Footer Ad */
.footer-ad {
  padding: 2rem 0;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.ad-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.ad-placeholder-footer {
  background: white;
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  color: #a0aec0;
  font-size: 1.125rem;
}

/* Animations */
.animate-fade-in {
  animation: fadeIn 1s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.scale-in-enter-active,
.scale-in-leave-active {
  transition: all 0.3s ease;
}

.scale-in-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.scale-in-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.125rem;
  }
  
  .glass-card {
    padding: 1.5rem;
  }
  
  .quick-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .links-container {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .cta-title {
    font-size: 2rem;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-buttons .btn-primary,
  .cta-buttons .btn-secondary {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .stat-number {
    font-size: 1.75rem;
  }
  
  .btn-primary,
  .btn-secondary {
    padding: 0.875rem 1.5rem;
    font-size: 0.875rem;
  }
  
  .result-content {
    flex-direction: column;
  }
  
  .result-input,
  .btn-copy,
  .btn-qr {
    width: 100%;
  }
}

/* Utility Classes */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.pt-24 {
  padding-top: 6rem;
}

.pb-16 {
  padding-bottom: 4rem;
}

.text-center {
  text-align: center;
}

.mb-12 {
  margin-bottom: 3rem;
}

.space-y-6 > * + * {
  margin-top: 1.5rem;
}

.grid {
  display: grid;
}

.gap-4 {
  gap: 1rem;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.z-10 {
  z-index: 10;
}

.overflow-hidden {
  overflow: hidden;
}

.min-h-screen {
  min-height: 100vh;
}

.max-w-4xl {
  max-width: 56rem;
}

.w-5 {
  width: 1.25rem;
}

.h-5 {
  height: 1.25rem;
}

@media (min-width: 768px) {
  .md\\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  
  .md\\:col-span-2 {
    grid-column: span 2 / span 2;
  }
}
</style>