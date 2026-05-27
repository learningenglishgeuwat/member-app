import { fireEvent, render, screen } from '@testing-library/react'
import DashboardSidebar from '../index'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
}))

jest.mock('@/contexts/MemberAuthContext', () => ({
  useAuth: () => ({
    user: {
      email: 'member@example.com',
      fullname: 'Member',
      tier: 'Rookie',
    },
    signOut: jest.fn(),
  }),
}))

describe('DashboardSidebar', () => {
  it('shows subscription prompt action for non-active users when Start Journey is clicked', () => {
    const onStartJourneyBlocked = jest.fn()
    const setCurrentView = jest.fn()

    render(
      <DashboardSidebar
        isOpen
        setIsOpen={jest.fn()}
        currentView="notifications"
        setCurrentView={setCurrentView}
        canAccessStartJourney={false}
        onStartJourneyBlocked={onStartJourneyBlocked}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /start journey/i }))

    expect(screen.getByRole('button', { name: /start journey/i })).not.toBeDisabled()
    expect(onStartJourneyBlocked).toHaveBeenCalledTimes(1)
    expect(setCurrentView).not.toHaveBeenCalled()
  })

  it('keeps Start Journey available for active users', () => {
    const setCurrentView = jest.fn()

    render(
      <DashboardSidebar
        isOpen
        setIsOpen={jest.fn()}
        currentView="dashboard"
        setCurrentView={setCurrentView}
        canAccessStartJourney
        onStartJourneyBlocked={jest.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /start journey/i }))

    expect(setCurrentView).toHaveBeenCalledWith('dashboard')
  })
})
