import { render, screen } from '@testing-library/react'
import RequireActiveWrapper from '../RequireActiveWrapper'
import { usePathname } from 'next/navigation'

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

jest.mock('@/app/components/RequireActive', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="require-active">{children}</div>
  ),
}))

const mockedUsePathname = usePathname as jest.Mock

describe('RequireActiveWrapper', () => {
  afterEach(() => {
    mockedUsePathname.mockReset()
  })

  it('renders children directly for public paths', () => {
    mockedUsePathname.mockReturnValue('/login')

    render(
      <RequireActiveWrapper>
        <div>Public content</div>
      </RequireActiveWrapper>
    )

    expect(screen.getByText('Public content')).toBeInTheDocument()
    expect(screen.queryByTestId('require-active')).not.toBeInTheDocument()
  })

  it('wraps children with RequireActive for private paths', () => {
    mockedUsePathname.mockReturnValue('/dashboard')

    render(
      <RequireActiveWrapper>
        <div>Private content</div>
      </RequireActiveWrapper>
    )

    expect(screen.getByText('Private content')).toBeInTheDocument()
    expect(screen.getByTestId('require-active')).toBeInTheDocument()
  })
})
