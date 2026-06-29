'use client'

import { useEffect, useState } from 'react'

export type NetworkQuality = 'excellent' | 'good' | 'poor' | 'offline'

interface NetworkInformation {
  effectiveType?: string
  rtt?: number
  downlink?: number
  saveData?: boolean
}

interface ConnectionInfo extends EventTarget {
  effectiveType?: string
  rtt?: number
  downlink?: number
  saveData?: boolean
}

const isPoorNetwork = (connection: NetworkInformation): boolean => {
  // Consider network poor if:
  // - effectiveType is 'slow-2g' or '2g'
  // - OR round-trip time is > 500ms
  // - OR downlink speed is < 1 Mbps
  // - OR saveData mode is enabled
  if (connection.saveData) return true
  if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') return true
  if (connection.rtt && connection.rtt > 500) return true
  if (connection.downlink && connection.downlink < 1) return true
  return false
}

const getInitialNetworkQuality = (): NetworkQuality => {
  // Check if Network Information API is available
  const connection = (navigator as unknown as { connection?: ConnectionInfo }).connection

  if (!connection) {
    // If API not available, assume good network
    return 'good'
  }

  if (!navigator.onLine) {
    return 'offline'
  }

  if (isPoorNetwork(connection)) {
    return 'poor'
  }

  return 'excellent'
}

export const useNetworkQuality = (): NetworkQuality => {
  const [networkQuality, setNetworkQuality] = useState<NetworkQuality>(getInitialNetworkQuality)

  useEffect(() => {
    // Check if Network Information API is available
    const connection = (navigator as unknown as { connection?: ConnectionInfo }).connection

    if (!connection) {
      // If API not available, no need to set up listeners
      return
    }

    const updateNetworkQuality = () => {
      if (!navigator.onLine) {
        setNetworkQuality('offline')
        return
      }

      if (isPoorNetwork(connection)) {
        setNetworkQuality('poor')
      } else {
        setNetworkQuality('excellent')
      }
    }

    // Listen for network changes
    connection.addEventListener('change', updateNetworkQuality)
    window.addEventListener('online', updateNetworkQuality)
    window.addEventListener('offline', updateNetworkQuality)

    return () => {
      connection.removeEventListener('change', updateNetworkQuality)
      window.removeEventListener('online', updateNetworkQuality)
      window.removeEventListener('offline', updateNetworkQuality)
    }
  }, [])

  return networkQuality
}
