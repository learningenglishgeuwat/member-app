class AudioManager {
  ctx?: AudioContext
  enabled = true

  init() {
    if (this.ctx) return
    const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext
    this.ctx = new Ctx()
  }

  async resume() {
    this.init()
    if (!this.ctx) return
    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume()
      } catch {
        // ignore
      }
    }
  }

  playTone({
    type = 'sine',
    frequency = 440,
    duration = 0.1,
    attack = 0.001,
    decay = 0.08,
    gain = 0.05,
    filterType,
    filterFreq,
  }: {
    type?: OscillatorType
    frequency?: number
    duration?: number
    attack?: number
    decay?: number
    gain?: number
    filterType?: BiquadFilterType
    filterFreq?: number
  }) {
    if (!this.enabled) return
    this.init()
    const ctx = this.ctx!

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc.type = type
    osc.frequency.setValueAtTime(frequency, now)

    let filter: BiquadFilterNode | null = null
    if (filterType && filterFreq) {
      filter = ctx.createBiquadFilter()
      filter.type = filterType
      filter.frequency.setValueAtTime(filterFreq, now)
    }

    gainNode.gain.setValueAtTime(0.0001, now)
    gainNode.gain.exponentialRampToValueAtTime(Math.max(gain, 0.0001), now + attack)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay)

    if (filter) {
      osc.connect(filter)
      filter.connect(gainNode)
    } else {
      osc.connect(gainNode)
    }

    gainNode.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + duration + 0.02)

    osc.onended = () => {
      try { osc.disconnect() } catch {}
      try { gainNode.disconnect() } catch {}
      if (filter) {
        try { filter.disconnect() } catch {}
      }
    }
  }

  async playTap() {
    await this.resume()
    const ctx = this.ctx!
    const now = ctx.currentTime

    try {
      // eslint-disable-next-line no-console
      console.debug('audioManager: playTap()')
    } catch {}

    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()

    // less 'full' tap: triangle gentle burst (previously keypress)
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(1000, now)
    osc.frequency.exponentialRampToValueAtTime(1300, now + 0.02)

    gainNode.gain.setValueAtTime(0.0001, now)
    gainNode.gain.exponentialRampToValueAtTime(0.02, now + 0.004)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.05)

    osc.connect(gainNode)
    gainNode.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.06)

    osc.onended = () => {
      try { osc.disconnect() } catch {}
      try { gainNode.disconnect() } catch {}
    }
  }

  async playKeypress() {
    await this.resume()
    const ctx = this.ctx!
    const now = ctx.currentTime
    try {
      // eslint-disable-next-line no-console
      console.debug('audioManager: playKeypress()')
    } catch {}
    // Thinner, shorter typing blip:
    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(1200, now)
    osc.frequency.exponentialRampToValueAtTime(1500, now + 0.01)

    gainNode.gain.setValueAtTime(0.0001, now)
    gainNode.gain.exponentialRampToValueAtTime(0.008, now + 0.002)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.035)

    osc.connect(gainNode)
    gainNode.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.04)

    osc.onended = () => {
      try { osc.disconnect() } catch {}
      try { gainNode.disconnect() } catch {}
    }
  }

  loadingOsc?: OscillatorNode
  loadingGain?: GainNode
  loadingFilter?: BiquadFilterNode
  loadingPulseTimer?: number | null

  cleanLoadingSound() {
    if (this.loadingOsc) {
      try { this.loadingOsc.disconnect() } catch {}
      this.loadingOsc = undefined
    }
    if (this.loadingGain) {
      try { this.loadingGain.disconnect() } catch {}
      this.loadingGain = undefined
    }
    if (this.loadingFilter) {
      try { this.loadingFilter.disconnect() } catch {}
      this.loadingFilter = undefined
    }
  }

  async startLoading() {
    await this.resume()
    if (!this.enabled) return
    if (this.loadingOsc) return

    const ctx = this.ctx!
    const now = ctx.currentTime

    // Menggunakan 'sine' murni dikombinasikan dengan filter ketat untuk kesan hologram digital yang bersih
    const source = ctx.createOscillator()
    source.type = 'sine'
    source.frequency.setValueAtTime(880, now)

    // BiquadFilter diatur ke 'bandpass' agar menyisakan frekuensi tengah yang terdengar fokus seperti sonar/radar fiksi ilmiah
    const filterNode = ctx.createBiquadFilter()
    filterNode.type = 'bandpass'
    filterNode.frequency.setValueAtTime(1200, now)
    filterNode.Q.setValueAtTime(5, now) // Q tinggi untuk fokus suara digital yang tajam tapi lembut

    const gainNode = ctx.createGain()
    gainNode.gain.setValueAtTime(0.0001, now)
    gainNode.gain.linearRampToValueAtTime(0.015, now + 0.15) // Fade-in halus saat protokol dimulai

    source.connect(filterNode)
    filterNode.connect(gainNode)
    gainNode.connect(ctx.destination)

    source.start(now)

    this.loadingOsc = source as any
    this.loadingGain = gainNode
    this.loadingFilter = filterNode

    let step = 0
    // Interval dipercepat menjadi 60ms agar selaras dengan animasi putaran lingkaran loading (micro-computational clicks)
    this.loadingPulseTimer = window.setInterval(() => {
      if (!this.loadingOsc || !this.loadingGain || !this.ctx) return
      const t = this.ctx.currentTime

      // Pola algoritma matematika fiksi ilmiah (suara naik turun beraturan seolah sedang memproses enkripsi/data)
      const baseFreqs = [900, 950, 1100, 850, 1200, 1000]
      const nextFreq = baseFreqs[step % baseFreqs.length]
      
      // Memberikan modulasi frekuensi filter secara berkala agar suaranya terasa "hidup" dan dinamis
      const filterSweep = 1200 + Math.sin(step * 0.5) * 300

      this.loadingOsc.frequency.setValueAtTime(nextFreq, t)
      filterNode.frequency.setValueAtTime(filterSweep, t)

      // Variasi volume super tipis untuk menyimulasikan paket data yang sedang masuk secara real-time
      const randomGain = 0.008 + (step % 2 === 0 ? 0.005 : 0)
      this.loadingGain.gain.setValueAtTime(randomGain, t)

      step++
    }, 60)
  }

  stopLoading() {
    if (!this.loadingOsc || !this.loadingGain || !this.ctx) return

    const now = this.ctx.currentTime
    const release = 0.12 // rilis cepat tapi tidak mendadak patah saat loading selesai
    this.loadingGain.gain.cancelScheduledValues(now)
    this.loadingGain.gain.setValueAtTime(Math.max(this.loadingGain.gain.value, 0.0001), now)
    this.loadingGain.gain.exponentialRampToValueAtTime(0.0001, now + release)

    this.loadingOsc.stop(now + release + 0.02)

    const osc = this.loadingOsc
    const gainNode = this.loadingGain
    const filter = this.loadingFilter

    osc.onended = () => {
      try { osc.disconnect() } catch {}
      try { gainNode.disconnect() } catch {}
      if (filter) {
        try { filter.disconnect() } catch {}
      }
    }

    if (this.loadingPulseTimer) {
      window.clearInterval(this.loadingPulseTimer)
      this.loadingPulseTimer = null
    }
    this.loadingOsc = undefined
    this.loadingGain = undefined
    this.loadingFilter = undefined
  }

  async playLoading(duration = 0.8) {
    await this.resume()
    const ctx = this.ctx!
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    const attack = Math.min(0.12, duration * 0.15)
    const release = Math.min(0.18, duration * 0.2)
    const sustainEnd = now + Math.max(0, duration - release)
    const stopTime = sustainEnd + release
    const freqSweepEnd = now + Math.min(0.4, duration * 0.4)

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(280, now)
    osc.frequency.exponentialRampToValueAtTime(520, freqSweepEnd)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(600, now)
    filter.frequency.exponentialRampToValueAtTime(2200, freqSweepEnd)

    gainNode.gain.setValueAtTime(0.0001, now)
    gainNode.gain.exponentialRampToValueAtTime(0.028, now + attack)
    gainNode.gain.setValueAtTime(0.028, sustainEnd)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, stopTime)

    osc.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(ctx.destination)

    osc.start(now)
    osc.stop(stopTime + 0.02)

    osc.onended = () => {
      try { osc.disconnect() } catch {}
      try { gainNode.disconnect() } catch {}
      try { filter.disconnect() } catch {}
    }
  }

  async playLaserClick() {
    await this.resume()
    // use original softer triangle tap sound for keypress (swapped)
    this.playTone({ type: 'triangle', frequency: 1100, duration: 0.05, attack: 0.002, decay: 0.04, gain: 0.02, filterType: 'highpass', filterFreq: 900 })

  }

  async playSuccess() {
    await this.resume()
    this.playTriumph()
  }

  async playTriumph() {
    await this.resume()
    const ctx = this.ctx!
    const now = ctx.currentTime

    const notes = [523.25, 659.25, 783.99, 1046.50]
    const dur = 0.09

    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.setValueAtTime(400, now)
    lp.Q.setValueAtTime(1, now)
    lp.connect(ctx.destination)

    notes.forEach((freq, i) => {
      const t = now + i * (dur * 0.18)
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(freq, t)
      gainNode.gain.setValueAtTime(0.001, t)
      gainNode.gain.exponentialRampToValueAtTime(0.06, t + 0.008)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, t + dur)
      osc.connect(gainNode)
      gainNode.connect(lp)
      osc.start(t)
      osc.stop(t + dur + 0.02)
      osc.onended = () => {
        try { osc.disconnect() } catch {}
        try { gainNode.disconnect() } catch {}
      }
    })

    lp.frequency.exponentialRampToValueAtTime(2200, now + notes.length * (dur * 0.18) + dur)
    setTimeout(() => {
      try { lp.disconnect() } catch {}
    }, (notes.length * (dur * 0.18) + dur + 0.1) * 1000)
  }

  async playCyberError() {
    await this.resume()
    const ctx = this.ctx!
    const now = ctx.currentTime

    const oscA = ctx.createOscillator()
    const oscB = ctx.createOscillator()
    const gainNode = ctx.createGain()
    const bp = ctx.createBiquadFilter()

    oscA.type = 'square'
    oscB.type = 'square'
    oscA.frequency.setValueAtTime(150, now)
    oscB.frequency.setValueAtTime(155, now)

    bp.type = 'bandpass'
    bp.frequency.setValueAtTime(500, now)
    bp.Q.setValueAtTime(8, now)

    gainNode.gain.setValueAtTime(0.0001, now)
    gainNode.gain.exponentialRampToValueAtTime(0.08, now + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.32)

    oscA.connect(gainNode)
    oscB.connect(gainNode)
    gainNode.connect(bp)
    bp.connect(ctx.destination)

    oscA.start(now)
    oscB.start(now)
    oscA.stop(now + 0.34)
    oscB.stop(now + 0.34)

    const cleanup = () => {
      try { oscA.disconnect() } catch {}
      try { oscB.disconnect() } catch {}
      try { gainNode.disconnect() } catch {}
      try { bp.disconnect() } catch {}
    }

    oscA.onended = cleanup
  }

  async playNeonHover() {
    await this.resume()
    this.playTone({ type: 'sine', frequency: 1200, duration: 0.05, attack: 0.002, decay: 0.04, gain: 0.01, filterType: 'highpass', filterFreq: 800 })
  }

  async playError() {
    await this.resume()
    this.playTone({ type: 'square', frequency: 220, duration: 0.22, attack: 0.002, decay: 0.18, gain: 0.05, filterType: 'highpass', filterFreq: 300 })
  }

  enable() {
    this.enabled = true
  }

  disable() {
    this.enabled = false
  }
}

export const audioManager = new AudioManager()
export default AudioManager