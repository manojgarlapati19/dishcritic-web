'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import {
  ArrowRight,
  Loader2,
  CheckCircle2,
  ChevronRight,
  Star,
  Camera,
  User,
  X,
  AlertCircle,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

type AuthMode = 'signin' | 'signup'
type OtpState = 'idle' | 'sending' | 'sent' | 'verifying' | 'verified'

// ─── Sample City Data ────────────────────────────────────────────────────────

const INDIAN_CITIES = [
  { name: 'Hyderabad', emoji: '🌆' },
  { name: 'Mumbai', emoji: '🌃' },
  { name: 'Delhi', emoji: '🏛️' },
  { name: 'Bengaluru', emoji: '🌐' },
  { name: 'Chennai', emoji: '🏝️' },
  { name: 'Kolkata', emoji: '🎭' },
  { name: 'Pune', emoji: '🏔️' },
  { name: 'Ahmedabad', emoji: '🏗️' },
  { name: 'Jaipur', emoji: '🏰' },
  { name: 'Lucknow', emoji: '🍢' },
]

// ─── Sample Review Cards for Brand Panel ─────────────────────────────────────

const SAMPLE_REVIEW_CARDS = [
  {
    text: 'Best biryani I have ever had. The aroma, the taste, everything was perfect.',
    score: 9.4,
    author: 'Arjun M.',
    restaurant: 'Paradise',
    emoji: '🍛',
  },
  {
    text: 'The butter chicken here is legendary. Creamy, rich, absolutely divine.',
    score: 9.1,
    author: 'Priya S.',
    restaurant: 'Bawarchi',
    emoji: '🍗',
  },
  {
    text: 'Street food at its finest. The chaat was bursting with flavours.',
    score: 8.8,
    author: 'Rahul K.',
    restaurant: 'Shah Ghouse',
    emoji: '🥘',
  },
]

// ─── OTP Input Component ─────────────────────────────────────────────────────

function OtpInput({
  length,
  value,
  onChange,
  disabled,
  hasError,
}: {
  length: number
  value: string[]
  onChange: (val: string[]) => void
  disabled: boolean
  hasError: boolean
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return
    const digit = val.slice(-1)
    const newValue = [...value]
    newValue[index] = digit
    onChange(newValue)

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    const newValue = [...value]
    for (let i = 0; i < pasted.length; i++) {
      newValue[i] = pasted[i]
    }
    onChange(newValue)
    const nextEmpty = newValue.findIndex((v) => !v)
    const focusIndex = nextEmpty === -1 ? length - 1 : nextEmpty
    inputRefs.current[focusIndex]?.focus()
  }

  return (
    <div className="flex items-center justify-center gap-2" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          disabled={disabled}
          className={cn(
            'w-11 h-12 sm:w-12 sm:h-14 text-center text-lg font-bold rounded-xl border-2 transition-all outline-none',
            hasError
              ? 'border-red-400 bg-red-50 text-red-600'
              : value[i]
                ? 'border-saffron bg-saffron/5 text-ink'
                : 'border-brown-muted/15 bg-cream-dark text-ink focus:border-saffron/50 focus:ring-2 focus:ring-saffron/20',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
      ))}
    </div>
  )
}

// ─── Countdown Timer ─────────────────────────────────────────────────────────

function CountdownTimer({ onComplete }: { onComplete: () => void }) {
  const [seconds, setSeconds] = useState(45)

  useEffect(() => {
    if (seconds <= 0) {
      onComplete()
      return
    }
    const timer = setTimeout(() => setSeconds(seconds - 1), 1000)
    return () => clearTimeout(timer)
  }, [seconds, onComplete])

  return (
    <span className="text-sm text-brown-muted">
      Resend in <span className="font-medium text-ink">{seconds}s</span>
    </span>
  )
}

// ─── Google Icon ─────────────────────────────────────────────────────────────

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

// ─── Brand Panel (Left Side) ────────────────────────────────────────────────

function BrandPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between w-[40%] min-h-screen bg-[#1E1208] p-8 sm:p-10 lg:p-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-saffron/5 via-transparent to-amber-500/5 pointer-events-none" />
      <div className="absolute top-20 -right-20 w-64 h-64 bg-saffron/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -left-20 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-saffron flex items-center justify-center">
            <span className="text-cream font-bold text-lg font-serif">D</span>
          </div>
          <span className="text-cream font-serif text-lg font-bold tracking-wide">DishCritic</span>
        </div>
      </div>

      <div className="relative z-10">
        <p className="text-cream font-serif text-2xl sm:text-3xl lg:text-4xl leading-tight font-bold">
          &ldquo;The best dish in your city
          <br />
          is waiting to be discovered&rdquo;
        </p>
        <div className="mt-6 flex items-center gap-3">
          <div className="h-px w-12 bg-saffron/50" />
          <span className="text-xs text-cream/50 uppercase tracking-wider font-medium">Explore & Review</span>
        </div>
      </div>

      <div className="relative z-10 space-y-3">
        {SAMPLE_REVIEW_CARDS.map((card, i) => (
          <div
            key={i}
            className="bg-cream/5 border border-cream/10 rounded-xl p-3.5 backdrop-blur-sm animate-float"
            style={{ animationDelay: `${i * 1.5}s` }}
          >
            <div className="flex items-start gap-2.5">
              <span className="text-lg shrink-0 mt-0.5">{card.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-cream/70 italic leading-relaxed line-clamp-2">
                  &ldquo;{card.text}&rdquo;
                </p>
                <div className="flex items-center justify-between mt-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-cream/50">{card.author}</span>
                    <span className="text-[10px] text-cream/30">&middot;</span>
                    <span className="text-[10px] text-cream/50">{card.restaurant}</span>
                  </div>
                  <span className="text-xs font-bold text-saffron">{card.score}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-3 border-t border-cream/10">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-saffron" />
              <span className="text-cream/60">Join 2.1 lakh food lovers</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-3.5 h-3.5 text-saffron fill-saffron/30" />
              <span className="text-cream/60">4.2 lakh dish reviews</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Auth Page Content ───────────────────────────────────────────────────────

export default function AuthPage() {
  const router = useRouter()

  // Mode
  const [mode, setMode] = useState<AuthMode>('signin')
  const [showEmailFallback, setShowEmailFallback] = useState(false)

  // Phone
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otpState, setOtpState] = useState<'idle' | 'sending' | 'sent' | 'verifying' | 'verified'>('idle')
  const [otpValue, setOtpValue] = useState<string[]>(Array(6).fill(''))
  const [countdownComplete, setCountdownComplete] = useState(false)
  const [otpError, setOtpError] = useState(false)

  // Sign Up additional fields
  const [fullName, setFullName] = useState('')
  const [selectedCityName, setSelectedCityName] = useState('')
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  // Email fallback
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Global state
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  // Supabase session
  const [sessionUserId, setSessionUserId] = useState<string | null>(null)

  const otpComplete = otpValue.every((d) => d !== '')

  const handleCountdownComplete = useCallback(() => {
    setCountdownComplete(true)
  }, [])

  const resetOtp = () => {
    setOtpState('idle')
    setOtpValue(Array(6).fill(''))
    setOtpError(false)
    setCountdownComplete(false)
  }

  // ─── Send OTP via Supabase ────────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10) return
    setOtpState('sending')
    setError(null)

    const { error: sendError } = await supabase.auth.signInWithOtp({
      phone: '+91' + phoneNumber,
    })

    if (sendError) {
      setError(sendError.message)
      setOtpState('idle')
      return
    }

    setOtpState('sent')
    setCountdownComplete(false)
  }

  // ─── Resend OTP ───────────────────────────────────────────────────────────
  const handleResendOtp = async () => {
    setCountdownComplete(false)
    setOtpValue(Array(6).fill(''))
    setOtpError(false)
    setOtpState('sending')
    setError(null)

    const { error: resendError } = await supabase.auth.signInWithOtp({
      phone: '+91' + phoneNumber,
    })

    if (resendError) {
      setError(resendError.message)
      setOtpState('idle')
      return
    }

    setOtpState('sent')
  }

  // ─── Verify OTP ───────────────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (!otpComplete) return
    setOtpState('verifying')
    setOtpError(false)
    setError(null)

    const otpCode = otpValue.join('')

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      phone: '+91' + phoneNumber,
      token: otpCode,
      type: 'sms',
    })

    if (verifyError) {
      setOtpError(true)
      setError('Invalid OTP. Please try again.')
      setOtpState('sent')
      return
    }

    setOtpState('verified')

    if (data?.user) {
      setSessionUserId(data.user.id)

      if (mode === 'signin') {
        // For sign in, check if profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single()

        if (existingProfile) {
          // Profile exists -> redirect
          setShowSuccess(true)
          setTimeout(() => router.push('/'), 2000)
        } else {
          // New user signing in but no profile yet - redirect to sign up flow
          setMode('signup')
        }
      }
    }
  }

  // ─── Google Sign In ────────────────────────────────────────────────────────
  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true)
    setError(null)

    const { error: googleError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback',
      },
    })

    if (googleError) {
      setError(googleError.message)
      setIsGoogleLoading(false)
    }
    // Redirect handled by Supabase
  }

  // ─── Email Sign In ────────────────────────────────────────────────────────
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    setError(null)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    setLoading(false)
    setShowSuccess(true)
    setTimeout(() => router.push('/'), 2000)
  }

  // ─── Create Account ───────────────────────────────────────────────────────
  const handleCreateAccount = async () => {
    if (!fullName || !selectedCityName) return
    setLoading(true)
    setError(null)

    if (!sessionUserId) {
      setError('Session expired. Please go back and verify your phone again.')
      setLoading(false)
      return
    }

    // Create/update profile
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: sessionUserId,
      name: fullName,
      phone: '+91' + phoneNumber,
      city_id: selectedCityName,
      avatar_url: null,
    })

    if (profileError) {
      setError(profileError.message)
      setLoading(false)
      return
    }

    setLoading(false)
    setShowSuccess(true)
    setTimeout(() => router.push('/'), 2000)
  }

  // ─── Mode switch ──────────────────────────────────────────────────────────
  const switchMode = (newMode: AuthMode) => {
    setMode(newMode)
    resetOtp()
    setShowEmailFallback(false)
    setError(null)
    setPhoneNumber('')
    setFullName('')
    setSelectedCityName('')
    setAvatarFile(null)
    setAvatarPreview(null)
    setEmail('')
    setPassword('')
    setSessionUserId(null)
  }

  // ─── Success state ────────────────────────────────────────────────────────
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#FBF6EE] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-green-100 flex items-center justify-center animate-scale-check">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ink mb-2">
            You&apos;re in!
          </h2>
          <p className="text-sm text-brown-muted animate-pulse-soft">
            Redirecting to DishCritic...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FBF6EE] flex">
      <BrandPanel />

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 lg:py-0">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-6 justify-center">
            <div className="w-8 h-8 rounded-lg bg-saffron flex items-center justify-center">
              <span className="text-cream font-bold text-base font-serif">D</span>
            </div>
            <span className="text-ink font-serif text-lg font-bold">DishCritic</span>
          </div>

          {/* Toggle Tabs */}
          <div className="flex items-center bg-cream-dark rounded-xl p-1 mb-6 border border-brown-muted/10">
            <button
              onClick={() => switchMode('signin')}
              className={cn(
                'flex-1 py-2.5 text-sm font-medium rounded-lg transition-all',
                mode === 'signin'
                  ? 'bg-cream text-ink shadow-sm'
                  : 'text-brown-muted hover:text-ink'
              )}
            >
              Sign In
            </button>
            <button
              onClick={() => switchMode('signup')}
              className={cn(
                'flex-1 py-2.5 text-sm font-medium rounded-lg transition-all',
                mode === 'signup'
                  ? 'bg-cream text-ink shadow-sm'
                  : 'text-brown-muted hover:text-ink'
              )}
            >
              Sign Up
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-ink">
              {mode === 'signin' ? 'Welcome back' : 'Join DishCritic'}
            </h1>
            <p className="text-sm text-brown-muted mt-1">
              {mode === 'signin'
                ? 'Sign in to continue reviewing'
                : 'Start reviewing India\'s best dishes'}
            </p>
          </div>

          {/* Form Content */}
          <div className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 animate-slide-down">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* PHONE INPUT */}
            {otpState !== 'verified' && (
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">
                  Phone Number
                </label>
                <div className="flex">
                  <div className="inline-flex items-center px-3.5 bg-cream-dark border border-brown-muted/15 border-r-0 rounded-l-xl text-sm font-medium text-ink shrink-0">
                    +91
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                      setPhoneNumber(val)
                    }}
                    placeholder="98765 43210"
                    disabled={otpState === 'sending' || otpState === 'sent' || loading}
                    className="flex-1 px-3.5 py-3 bg-cream-dark border border-brown-muted/15 rounded-r-xl text-sm text-ink placeholder:text-brown-muted/40 focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron/50 transition-all disabled:opacity-50"
                  />
                </div>
              </div>
            )}

            {/* OTP SENDING */}
            {otpState === 'sending' && (
              <div className="text-center py-4 animate-fade-in">
                <Loader2 className="w-6 h-6 animate-spin text-saffron mx-auto mb-2" />
                <p className="text-sm text-brown-muted">Sending OTP to +91 {phoneNumber}</p>
              </div>
            )}

            {/* OTP SENT */}
            {otpState === 'sent' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <p className="text-sm font-medium text-ink mb-2.5 text-center">
                    Enter the 6-digit OTP sent to +91 {phoneNumber}
                  </p>
                  <OtpInput
                    length={6}
                    value={otpValue}
                    onChange={setOtpValue}
                    disabled={otpState === 'verifying'}
                    hasError={otpError}
                  />
                  {otpError && (
                    <p className="text-xs text-red-500 text-center mt-1.5">
                      Incorrect OTP. Please try again.
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  {countdownComplete ? (
                    <button
                      onClick={handleResendOtp}
                      className="text-sm text-saffron font-medium hover:underline"
                    >
                      Resend OTP
                    </button>
                  ) : (
                    <CountdownTimer onComplete={handleCountdownComplete} />
                  )}
                  <button
                    onClick={() => resetOtp()}
                    className="text-sm text-brown-muted hover:text-ink hover:underline"
                  >
                    Change number
                  </button>
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={!otpComplete || otpState === 'verifying'}
                  className={cn(
                    'w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.97] min-h-[48px]',
                    otpComplete && otpState !== 'verifying'
                      ? 'bg-saffron text-cream hover:bg-saffron-light shadow-sm'
                      : 'bg-cream-dark text-brown-muted/50 cursor-not-allowed'
                  )}
                >
                  {otpState === 'verifying' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify OTP
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* OTP VERIFIED — SIGN UP FIELDS */}
            {otpState === 'verified' && mode === 'signup' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  <p className="text-sm text-green-700">
                    Phone verified! Now complete your profile.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Arjun Mehta"
                    className="w-full px-3.5 py-3 bg-cream-dark border border-brown-muted/15 rounded-xl text-sm text-ink placeholder:text-brown-muted/40 focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron/50 transition-all"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-ink mb-1.5">
                    Your City
                  </label>
                  <button
                    onClick={() => setShowCityDropdown(!showCityDropdown)}
                    className="w-full flex items-center justify-between px-3.5 py-3 bg-cream-dark border border-brown-muted/15 rounded-xl text-sm text-left transition-all hover:border-brown-muted/30"
                  >
                    {selectedCityName ? (
                      <span className="text-ink">
                        {INDIAN_CITIES.find((c) => c.name === selectedCityName)?.emoji} {selectedCityName}
                      </span>
                    ) : (
                      <span className="text-brown-muted/50">Select your city</span>
                    )}
                    <ChevronRight
                      className={cn(
                        'w-4 h-4 text-brown-muted transition-transform',
                        showCityDropdown && 'rotate-90'
                      )}
                    />
                  </button>
                  {showCityDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-cream border border-brown-muted/15 rounded-xl shadow-xl z-10 max-h-48 overflow-y-auto">
                      {INDIAN_CITIES.map((city) => (
                        <button
                          key={city.name}
                          onClick={() => {
                            setSelectedCityName(city.name)
                            setShowCityDropdown(false)
                          }}
                          className={cn(
                            'w-full text-left px-3.5 py-2.5 text-sm hover:bg-cream-dark transition-colors flex items-center gap-2',
                            selectedCityName === city.name && 'bg-saffron/5 text-saffron font-medium'
                          )}
                        >
                          <span>{city.emoji}</span>
                          <span>{city.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">
                    Profile Photo <span className="text-brown-muted/60">(optional)</span>
                  </label>
                  <label className="cursor-pointer block">
                    <div className="flex items-center gap-3 px-3.5 py-3 bg-cream-dark border border-dashed border-brown-muted/20 rounded-xl text-brown-muted hover:border-saffron/30 hover:text-saffron transition-all">
                      <Camera className="w-4 h-4" />
                      <span className="text-sm">
                        {avatarPreview ? 'Change photo' : 'Upload a photo'}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setAvatarFile(file)
                          const reader = new FileReader()
                          reader.onloadend = () => setAvatarPreview(reader.result as string)
                          reader.readAsDataURL(file)
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  {avatarPreview && (
                    <div className="flex items-center gap-3 mt-2">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <Image src={avatarPreview} alt="Preview" className="w-full h-full object-cover" width={40} height={40} unoptimized />
                      </div>
                      <button
                        onClick={() => {
                          setAvatarFile(null)
                          setAvatarPreview(null)
                        }}
                        className="text-xs text-brown-muted hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleCreateAccount}
                  disabled={!fullName || !selectedCityName || loading}
                  className={cn(
                    'w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all active:scale-[0.97] min-h-[48px]',
                    fullName && selectedCityName && !loading
                      ? 'bg-saffron text-cream hover:bg-saffron-light shadow-sm'
                      : 'bg-cream-dark text-brown-muted/50 cursor-not-allowed'
                  )}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-brown-muted/60 text-center leading-relaxed">
                  By creating an account you agree to our{' '}
                  <a href="#" className="text-saffron hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-saffron hover:underline">Privacy Policy</a>
                </p>
              </div>
            )}

            {/* IDLE STATE */}
            {otpState === 'idle' && (
              <>
                <button
                  onClick={handleSendOtp}
                  disabled={phoneNumber.length < 10}
                  className={cn(
                    'w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all active:scale-[0.97] min-h-[48px]',
                    phoneNumber.length >= 10
                      ? 'bg-saffron text-cream hover:bg-saffron-light shadow-sm'
                      : 'bg-cream-dark text-brown-muted/50 cursor-not-allowed'
                  )}
                >
                  Send OTP
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-brown-muted/15" />
                  <span className="text-xs text-brown-muted/60 shrink-0">or continue with</span>
                  <div className="flex-1 h-px bg-brown-muted/15" />
                </div>

                <button
                  onClick={handleGoogleAuth}
                  disabled={isGoogleLoading}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-cream border border-brown-muted/15 rounded-xl text-sm font-medium text-ink hover:shadow-sm hover:border-brown-muted/25 transition-all active:scale-[0.97] min-h-[48px]"
                >
                  {isGoogleLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <GoogleIcon className="w-5 h-5" />
                  )}
                  {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
                </button>

                {!showEmailFallback ? (
                  <button
                    onClick={() => setShowEmailFallback(true)}
                    className="w-full text-center text-sm text-brown-muted hover:text-saffron transition-colors"
                  >
                    Use email instead
                  </button>
                ) : (
                  <div className="space-y-3 animate-slide-down pt-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-brown-muted/15" />
                      <span className="text-xs text-brown-muted/60">Email sign in</span>
                      <div className="flex-1 h-px bg-brown-muted/15" />
                    </div>

                    <form onSubmit={handleEmailSignIn} className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full px-3.5 py-3 bg-cream-dark border border-brown-muted/15 rounded-xl text-sm text-ink placeholder:text-brown-muted/40 focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron/50 transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">
                          Password
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3.5 py-3 bg-cream-dark border border-brown-muted/15 rounded-xl text-sm text-ink placeholder:text-brown-muted/40 focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron/50 transition-all"
                          required
                          minLength={6}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!email || !password || loading}
                        className={cn(
                          'w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.97] min-h-[48px]',
                          email && password && !loading
                            ? 'bg-saffron text-cream hover:bg-saffron-light shadow-sm'
                            : 'bg-cream-dark text-brown-muted/50 cursor-not-allowed'
                        )}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Signing In...
                          </>
                        ) : (
                          <>
                            Sign In with Email
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>

                    <button
                      onClick={() => setShowEmailFallback(false)}
                      className="w-full text-center text-sm text-brown-muted hover:text-saffron transition-colors"
                    >
                      Use phone OTP instead
                    </button>
                  </div>
                )}

                {mode === 'signup' && (
                  <p className="text-xs text-brown-muted/60 text-center">
                    Already have an account?{' '}
                    <button
                      onClick={() => switchMode('signin')}
                      className="text-saffron font-medium hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
