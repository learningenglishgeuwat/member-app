import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import StartJourney, { buildPronunciationCalendarPrompt } from '../index'

const pushMock = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

jest.mock('@/lib/haptic/useHaptic', () => ({
  useHaptic: () => ({
    triggerHaptic: jest.fn(),
  }),
}))

jest.mock('@/app/dashboard/components/TutorialContent/PronunciationRoadmapModal', () => ({
  __esModule: true,
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div role="dialog" aria-label="Pronunciation Roadmap">Pronunciation Roadmap</div> : null,
}))

const renderGeneratedPlan = async () => {
  render(<StartJourney />)

  fireEvent.change(screen.getByPlaceholderText(/aku ingin/i), {
    target: { value: 'Belajar pronunciation' },
  })
  fireEvent.click(screen.getByRole('button', { name: /enter/i }))

  await act(async () => {
    jest.advanceTimersByTime(1500)
  })

  await screen.findByRole('button', { name: /latihan terarah/i })
}

describe('StartJourney Phase 2', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    window.localStorage.clear()
    pushMock.mockClear()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('opens the Phase 2 popup from Latihan Terarah', async () => {
    await renderGeneratedPlan()

    fireEvent.click(screen.getByRole('button', { name: /latihan terarah/i }))

    expect(screen.getByRole('dialog', { name: /latihan terarah/i })).toBeInTheDocument()
    expect(screen.getByText(/roadmap strategis/i)).toBeInTheDocument()
    expect(screen.getByText(/status & pencapaian/i)).toBeInTheDocument()
  })

  it('opens Pronunciation Roadmap from Pahami Fondasi', async () => {
    await renderGeneratedPlan()

    fireEvent.click(screen.getByRole('button', { name: /latihan terarah/i }))
    fireEvent.click(screen.getByRole('button', { name: /roadmap strategis/i }))

    expect(screen.getByRole('dialog', { name: /pronunciation roadmap/i })).toBeInTheDocument()
  })

  it('switches dashboard view to progress from Pahami View Progress', async () => {
    const viewEvents: string[] = []
    window.addEventListener('geuwat:dashboard-view', ((event: CustomEvent<{ viewId?: string }>) => {
      if (event.detail.viewId) viewEvents.push(event.detail.viewId)
    }) as EventListener)
    await renderGeneratedPlan()

    fireEvent.click(screen.getByRole('button', { name: /latihan terarah/i }))
    fireEvent.click(screen.getByRole('button', { name: /status & pencapaian/i }))

    expect(window.localStorage.getItem('dashboardCurrentView')).toBe('progress')
    expect(viewEvents).toContain('progress')
  })

  it('shows the dictionary reference links', async () => {
    await renderGeneratedPlan()

    fireEvent.click(screen.getByRole('button', { name: /latihan terarah/i }))
    fireEvent.click(screen.getByRole('button', { name: /referensi/i }))

    expect(screen.getByRole('link', { name: /longman/i })).toHaveAttribute(
      'href',
      'https://www.ldoceonline.com/dictionary/',
    )
    expect(screen.getByRole('link', { name: /cambridge/i })).toHaveAttribute(
      'href',
      'https://dictionary.cambridge.org/',
    )
    expect(screen.getByRole('link', { name: /oxford/i })).toHaveAttribute(
      'href',
      'https://www.oxfordlearnersdictionaries.com/',
    )
  })

  it('shows a Gemini Google Calendar prompt', async () => {
    await renderGeneratedPlan()

    fireEvent.click(screen.getByRole('button', { name: /latihan terarah/i }))
    fireEvent.click(screen.getByRole('button', { name: /sinkronisasi jadwal/i }))
    fireEvent.change(screen.getByLabelText(/tanggal mulai/i), {
      target: { value: '2026-05-26' },
    })

    await waitFor(() => {
      const prompt = screen.getByLabelText(/prompt google calendar/i) as HTMLTextAreaElement
      expect(prompt.value).toContain('GEUWAT PRONUNCIATION')
      expect(prompt.value).toContain('Meeting 1: Alphabet Symbols + Spelling Exercise')
      expect(prompt.value).toContain('/skill/pronunciation/alphabet')
      expect(prompt.value).toContain('Notifikasi: 5 menit sebelum acara')
    })
  })

  it('builds deterministic pronunciation calendar prompts', () => {
    const prompt = buildPronunciationCalendarPrompt({
      startDate: '2026-05-26',
      selectedDays: [2],
      startTime: '18:52',
      endTime: '19:30',
      notificationMinutes: '5',
      baseUrl: 'https://learningenglishgeuwat-ten.vercel.app',
    })

    expect(prompt).toContain('Waktu: 26 Mei 2026 jam 18:52 - 19:30')
    expect(prompt).toContain('GEUWAT PRONUNCIATION')
    expect(prompt).toContain('Meeting 26: Contraction: Negatif dan Informal')
    expect(prompt).toContain('https://learningenglishgeuwat-ten.vercel.app/skill/pronunciation/contraction')
  })
})
