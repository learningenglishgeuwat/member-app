export function getDeviceId() {
  if (typeof window === 'undefined') return null
  const key = 'device_id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = createUuid()
    localStorage.setItem(key, id)
  }
  return id
}

function createUuid() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const buf = new Uint8Array(16)
    crypto.getRandomValues(buf)
    // RFC 4122 version 4
    buf[6] = (buf[6] & 0x0f) | 0x40
    buf[8] = (buf[8] & 0x3f) | 0x80
    const hex = Array.from(buf, (b) => b.toString(16).padStart(2, '0'))
    return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`
  }
  // very last resort
  return `dev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
