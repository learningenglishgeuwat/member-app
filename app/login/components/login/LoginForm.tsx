'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { getDeviceId } from '@/lib/device'
import { FormBackground } from './ui/FormBackground'
import { LoginHeader } from './ui/LoginHeader'
import { GearInputRow } from './form/GearInputRow'
import { LoginButton } from './form/LoginButton'
import { LoginErrorPopup } from './form/LoginErrorPopup'

interface LoginFormProps {
  onLogin?: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const router = useRouter()
  
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  })
  const [activationState, setActivationState] = React.useState({
    emailActive: false,
    passwordActive: false,
  })
  const [showErrorPopup, setShowErrorPopup] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')
  const [retryCount, setRetryCount] = React.useState(0)
  const [showForgotPassword, setShowForgotPassword] = React.useState(false)

  // Computed properties
  const isFullyActive = activationState.emailActive && activationState.passwordActive
  const isPartiallyActive = activationState.emailActive || activationState.passwordActive

  // Handlers
  const toggleEmailGear = () => {
    setActivationState((prev) => ({ ...prev, emailActive: !prev.emailActive }))
  }

  const togglePasswordGear = () => {
    setActivationState((prev) => ({
      ...prev,
      passwordActive: !prev.passwordActive,
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const closeErrorPopup = () => {
    setShowErrorPopup(false)
    setErrorMessage('')
    setShowForgotPassword(false)
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!isFullyActive) {
      setErrorMessage('Please activate both security gears first!')
      setShowErrorPopup(true)
      return
    }

    setIsLoading(true)

    try {
      // Use real Supabase authentication
      const result = await signIn(formData.email, formData.password)
      
      if (!result.success) {
        console.error('❌ Supabase auth error:', result.error)
        const isInvalidCredentials = result.error === 'Invalid login credentials'
        const baseMessage = isInvalidCredentials
          ? 'Email atau kata sandi salah.'
          : `Gagal login: ${result.error}`
        setErrorMessage(baseMessage)
        setShowForgotPassword(isInvalidCredentials)
        setShowErrorPopup(true)
        setIsLoading(false)
        if (result.error?.toLowerCase().includes('koneksi lambat') && retryCount < 1) {
          setRetryCount((prev) => prev + 1)
          setTimeout(() => {
            handleSubmit()
          }, 1200)
        }
        return
      }

      const deviceId = getDeviceId()
      if (deviceId) {
        const deviceLabel = /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'
        const { error: deviceError } = await (supabase as any).rpc('register_device', {
          p_device_id: deviceId,
          p_label: deviceLabel,
          p_user_agent: navigator.userAgent,
          p_ip: null,
        })

        if (deviceError) {
          if (deviceError.message?.includes('MAX_DEVICE_REACHED')) {
            router.push('/device-pairing')
            return
          }
          console.warn('Device registration error:', deviceError.message)
        }
      }

      console.log('✅ Login successful')
      onLogin?.()
      router.push('/dashboard')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat masuk.'
      console.error('❌ Unexpected login error:', err)
      setErrorMessage(message)
      setShowErrorPopup(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto perspective-1000">
      {/* Background Ambience */}
      <FormBackground isFullyActive={isFullyActive} />

      {/* Error Popup */}
      <LoginErrorPopup
        isOpen={showErrorPopup}
        errorMessage={errorMessage}
        onClose={closeErrorPopup}
        showForgotPassword={showForgotPassword}
      />
      {showErrorPopup && (
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-full border border-amber-400/60 px-4 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-400/10 disabled:opacity-50"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Main Content Card */}
      <div className="relative p-2">
        {/* Header & Logo Section */}
        <LoginHeader
          isFullyActive={isFullyActive}
          isPartiallyActive={isPartiallyActive}
        />

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Email Field - Right Gear (Pink/Fuchsia Theme) */}
          <GearInputRow
            variant="right"
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            isActive={activationState.emailActive}
            onToggle={toggleEmailGear}
            onChange={handleChange}
            // Explicit Styling
            gearColorClass="text-fuchsia-500"
            containerShadowClass="shadow-fuchsia-500/5"
            innerGlowClass="bg-fuchsia-500/5"
          />

          {/* Password Field - Left Gear (Purple/Violet Theme) */}
          <GearInputRow
            variant="left"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            isActive={activationState.passwordActive}
            onToggle={togglePasswordGear}
            onChange={handleChange}
            // Explicit Styling
            gearColorClass="text-violet-500"
            containerShadowClass="shadow-violet-500/5"
            innerGlowClass="bg-violet-500/5"
          />

          {/* Submit Action */}
          <LoginButton isLoading={isLoading} isEnabled={isFullyActive} />
        </form>
      </div>
    </div>
  )
}
