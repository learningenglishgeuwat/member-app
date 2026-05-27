import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type React from 'react'
import { LoginForm } from '../LoginForm'
import { DASHBOARD_VIEW_STORAGE_KEY, NOTIFICATIONS_VIEW_ID } from '@/app/dashboard/dashboardView'
import { signIn } from '@/lib/auth'

const pushMock = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

jest.mock('@/lib/auth', () => ({
  signIn: jest.fn(),
}))

jest.mock('@/lib/supabase', () => ({
  supabaseLoose: {
    rpc: jest.fn(),
  },
}))

jest.mock('@/lib/device', () => ({
  getDeviceId: () => null,
}))

jest.mock('@/lib/haptic/useHaptic', () => ({
  useHaptic: () => ({
    triggerHaptic: jest.fn(),
  }),
}))

jest.mock('../ui/FormBackground', () => ({
  FormBackground: () => null,
}))

jest.mock('../ui/LoginHeader', () => ({
  LoginHeader: () => null,
}))

jest.mock('../form/LoginErrorPopup', () => ({
  LoginErrorPopup: () => null,
}))

jest.mock('../form/GearInputRow', () => ({
  GearInputRow: ({
    name,
    placeholder,
    value,
    onToggle,
    onChange,
  }: {
    name: string
    placeholder: string
    value: string
    onToggle: () => void
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  }) => (
    <div>
      <button type="button" onClick={onToggle}>
        Activate {name}
      </button>
      <input name={name} placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  ),
}))

jest.mock('../form/LoginButton', () => ({
  LoginButton: ({ isLoading, isEnabled }: { isLoading: boolean; isEnabled: boolean }) => (
    <button type="submit" disabled={!isEnabled || isLoading}>
      Sign In
    </button>
  ),
}))

const mockedSignIn = signIn as jest.Mock

describe('LoginForm', () => {
  beforeEach(() => {
    pushMock.mockClear()
    mockedSignIn.mockReset()
    window.localStorage.clear()
  })

  it('saves notifications as target view before redirecting to dashboard', async () => {
    mockedSignIn.mockResolvedValue({ success: true, userId: 'user-1' })

    render(<LoginForm />)

    fireEvent.click(screen.getByRole('button', { name: /activate email/i }))
    fireEvent.click(screen.getByRole('button', { name: /activate password/i }))
    fireEvent.change(screen.getByPlaceholderText(/email address/i), {
      target: { value: 'member@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'secret-password' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/dashboard')
    })
    expect(window.localStorage.getItem(DASHBOARD_VIEW_STORAGE_KEY)).toBe(NOTIFICATIONS_VIEW_ID)
  })
})
