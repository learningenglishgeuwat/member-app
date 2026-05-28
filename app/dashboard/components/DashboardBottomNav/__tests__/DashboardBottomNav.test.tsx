import { fireEvent, render, screen } from '@testing-library/react'
import DashboardBottomNav from '../index'

const baseProps = {
  isSidebarOpen: false,
  toggleSidebar: jest.fn(),
  isTourGuideBootstrapped: false,
  handleEnableTourGuide: jest.fn(),
  handleResetTourGuide: jest.fn(),
  handleStartJourney: jest.fn(),
}

describe('DashboardBottomNav', () => {
  it('keeps Start Journey clickable', () => {
    render(<DashboardBottomNav {...baseProps} />)

    const startJourneyButton = screen.getByRole('button', { name: /start journey/i })
    fireEvent.click(startJourneyButton)

    expect(startJourneyButton).not.toBeDisabled()
    expect(baseProps.handleStartJourney).toHaveBeenCalledTimes(1)
  })
})
