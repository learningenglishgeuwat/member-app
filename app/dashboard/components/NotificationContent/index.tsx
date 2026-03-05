'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Bell, CheckCircle, AlertCircle, Info, Star } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/MemberAuthContext'
import type { Notification, GeneralUpdate, NotificationUpdate } from '@/types/database'

const PAGE_SIZE = 10

type NotificationFeedItem = {
  id: string
  type: string
  content: string
  created_at: string
  _createdAtMs: number
  _isGeneral: boolean
  title: string | null
  status: string | null
  read_at: string | null
}

const toFeedItem = (item: Notification | GeneralUpdate, isGeneral: boolean): NotificationFeedItem => ({
  id: item.id,
  type: item.type || 'info',
  content: item.content || '',
  created_at: item.created_at,
  _createdAtMs: Date.parse(item.created_at) || 0,
  _isGeneral: isGeneral,
  title: isGeneral && 'title' in item ? item.title ?? null : null,
  status: !isGeneral && 'status' in item ? item.status ?? null : null,
  read_at: !isGeneral && 'read_at' in item ? item.read_at ?? null : null,
})

const mergeByNewest = (
  personalFeed: NotificationFeedItem[],
  generalFeed: NotificationFeedItem[],
): NotificationFeedItem[] => {
  const merged: NotificationFeedItem[] = []
  let personalIndex = 0
  let generalIndex = 0

  while (personalIndex < personalFeed.length && generalIndex < generalFeed.length) {
    if (personalFeed[personalIndex]._createdAtMs >= generalFeed[generalIndex]._createdAtMs) {
      merged.push(personalFeed[personalIndex])
      personalIndex += 1
    } else {
      merged.push(generalFeed[generalIndex])
      generalIndex += 1
    }
  }

  if (personalIndex < personalFeed.length) {
    merged.push(...personalFeed.slice(personalIndex))
  }
  if (generalIndex < generalFeed.length) {
    merged.push(...generalFeed.slice(generalIndex))
  }

  return merged
}

const NotificationContent: React.FC = () => {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [generalUpdates, setGeneralUpdates] = useState<GeneralUpdate[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const [hasMorePersonal, setHasMorePersonal] = useState(false)
  const [hasMoreGeneral, setHasMoreGeneral] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const currentPageRef = useRef(0)
  const fetchRequestIdRef = useRef(0)
  const isFetchingRef = useRef(false)

  const fetchNotifications = useCallback(async (loadMore = false) => {
    if (!userId || isFetchingRef.current) return
    isFetchingRef.current = true
    const requestId = ++fetchRequestIdRef.current

    if (loadMore) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }
    setError(null)

    const nextPage = loadMore ? currentPageRef.current + 1 : 0
    const from = nextPage * PAGE_SIZE
    // Request one extra item to determine "has more" without exact count.
    const to = from + PAGE_SIZE

    try {
      const [personalResult, generalResult] = await Promise.all([
        supabase
          .from('notifications')
          .select('id, recipient_id, type, content, status, read_at, created_at')
          .eq('recipient_id', userId)
          .order('created_at', { ascending: false })
          .range(from, to),
        supabase
          .from('general_updates')
          .select('id, title, type, content, is_active, created_at')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .range(from, to),
      ])

      if (requestId !== fetchRequestIdRef.current) return

      if (personalResult.error || generalResult.error) {
        setError('Gagal memuat notifikasi.')
        setNotifications([])
        setGeneralUpdates([])
        return
      }

      const personalData = (personalResult.data || []) as Notification[]
      const generalData = (generalResult.data || []) as GeneralUpdate[]
      const personalPageData = personalData.slice(0, PAGE_SIZE)
      const generalPageData = generalData.slice(0, PAGE_SIZE)

      setNotifications(prev => (loadMore ? [...prev, ...personalPageData] : personalPageData))
      setGeneralUpdates(prev => (loadMore ? [...prev, ...generalPageData] : generalPageData))

      setHasMorePersonal(personalData.length > PAGE_SIZE)
      setHasMoreGeneral(generalData.length > PAGE_SIZE)
      currentPageRef.current = nextPage
    } finally {
      if (requestId === fetchRequestIdRef.current) {
        setLoading(false)
        setLoadingMore(false)
      }
      isFetchingRef.current = false
    }
  }, [userId])

  useEffect(() => {
    if (!userId) {
      setNotifications([])
      setGeneralUpdates([])
      setHasMorePersonal(false)
      setHasMoreGeneral(false)
      setLoading(false)
      setLoadingMore(false)
      currentPageRef.current = 0
      fetchRequestIdRef.current += 1
      isFetchingRef.current = false
      return
    }
    const timerId = window.setTimeout(() => {
      void fetchNotifications(false)
    }, 0)
    return () => window.clearTimeout(timerId)
  }, [fetchNotifications, userId])

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'achievement':
        return 'from-amber-500 to-amber-600'
      case 'reminder':
        return 'from-blue-500 to-blue-600'
      case 'success':
        return 'from-green-500 to-green-600'
      case 'info':
        return 'from-purple-500 to-purple-600'
      case 'warning':
        return 'from-red-500 to-red-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getNotificationBorder = (type: string) => {
    switch (type) {
      case 'achievement':
        return 'border-amber-500/30'
      case 'reminder':
        return 'border-blue-500/30'
      case 'success':
        return 'border-green-500/30'
      case 'info':
        return 'border-purple-500/30'
      case 'warning':
        return 'border-red-500/30'
      default:
        return 'border-gray-500/30'
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return Star
      case 'reminder':
        return Bell
      case 'success':
        return CheckCircle
      case 'info':
        return Info
      case 'warning':
        return AlertCircle
      default:
        return Bell
    }
  }

  const getNotificationTitle = (type: string) => {
    switch (type) {
      case 'achievement':
        return 'Achievement'
      case 'reminder':
        return 'Reminder'
      case 'success':
        return 'Success'
      case 'info':
        return 'Info'
      case 'warning':
        return 'Warning'
      default:
        return 'Notification'
    }
  }

  const formatTimeAgo = (iso: string) => {
    const date = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    if (diffMs < 0) return 'baru saja'

    const minutes = Math.floor(diffMs / 60000)
    if (minutes < 1) return 'baru saja'
    if (minutes < 60) return `${minutes} menit lalu`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} jam lalu`

    const days = Math.floor(hours / 24)
    if (days < 7) return `${days} hari lalu`

    const weeks = Math.floor(days / 7)
    if (weeks < 4) return `${weeks} minggu lalu`

    const months = Math.floor(days / 30)
    if (months < 12) return `${months} bulan lalu`

    const years = Math.floor(days / 365)
    return `${years} tahun lalu`
  }

  const renderContentWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g
    const parts = text.split(urlRegex).filter(Boolean)
    return parts.map((part, index) => {
      const isUrl = /^https?:\/\//i.test(part) || /^www\./i.test(part)
      if (!isUrl) return <React.Fragment key={index}>{part}</React.Fragment>

      const href = part.startsWith('http') ? part : `https://${part}`
      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-300 hover:text-cyan-200 underline underline-offset-2"
        >
          {part}
        </a>
      )
    })
  }

  const mergedFeedNewest = useMemo(() => {
    const personalFeed = notifications.map((item) => toFeedItem(item, false))
    const generalFeed = generalUpdates.map((item) => toFeedItem(item, true))
    return mergeByNewest(personalFeed, generalFeed)
  }, [notifications, generalUpdates])

  const visibleFeed = useMemo(
    () => (sortOrder === 'newest' ? mergedFeedNewest : [...mergedFeedNewest].reverse()),
    [mergedFeedNewest, sortOrder],
  )

  const { totalCount, unreadCount, readCount } = useMemo(() => {
    const total = mergedFeedNewest.length
    const unread = mergedFeedNewest.filter(
      (item) => !item._isGeneral && (item.status || '').toLowerCase() !== 'read' && !item.read_at,
    ).length
    const read = total - unread
    return { totalCount: total, unreadCount: unread, readCount: read }
  }, [mergedFeedNewest])

  const handleMarkAsRead = async (id: string) => {
    if (!user?.id) return
    const now = new Date().toISOString()
    const updatePayload: NotificationUpdate = { status: 'read', read_at: now }
    const { error: updateError } = await supabase
      .from('notifications')
      // NOTE: Supabase client typing in this repo resolves update payload as never.
      .update(updatePayload as never)
      .eq('id', id)
      .eq('recipient_id', user.id)

    if (updateError) {
      console.error('Failed to mark as read:', updateError)
      return
    }

    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, status: 'read', read_at: now } : n))
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wider">
            NOTIFICATION <span className="text-purple-500">CENTER</span>
          </h2>
          <p className="text-slate-400 font-mono text-xs sm:text-sm">
            Stay updated with your learning progress and platform news.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label
            htmlFor="notification-sort-order"
            className="text-[11px] sm:text-xs text-slate-400 font-mono"
          >
            Sort
          </label>
          <select
            id="notification-sort-order"
            name="notificationSortOrder"
            className="bg-slate-900/70 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </header>

      {/* Notification Stats */}
      <div className="grid grid-cols-3 md:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
        <div className="bg-slate-900/50 border border-purple-500/20 p-4 sm:p-5 md:p-6 rounded-xl backdrop-blur-sm text-center">
          <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">{totalCount}</div>
          <div className="text-xs sm:text-sm text-slate-400">Total Notifications</div>
        </div>
        <div className="bg-slate-900/50 border border-purple-500/20 p-4 sm:p-5 md:p-6 rounded-xl backdrop-blur-sm text-center">
          <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-1 sm:mb-2">{unreadCount}</div>
          <div className="text-xs sm:text-sm text-slate-400">Unread</div>
        </div>
        <div className="bg-slate-900/50 border border-purple-500/20 p-4 sm:p-5 md:p-6 rounded-xl backdrop-blur-sm text-center">
          <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-1 sm:mb-2">{readCount}</div>
          <div className="text-xs sm:text-sm text-slate-400">Read</div>
        </div>
      </div>

      {/* Notification List */}
      <div className="space-y-3 sm:space-y-4">
        {loading && (
          <div className="bg-slate-900/50 border border-slate-800 p-4 sm:p-6 rounded-xl text-slate-400 text-sm">
            Memuat notifikasi...
          </div>
        )}
        {!loading && error && (
          <div className="bg-slate-900/50 border border-red-500/30 p-4 sm:p-6 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}
        {!loading && !error && mergedFeedNewest.length === 0 && (
          <div className="bg-slate-900/50 border border-slate-800 p-4 sm:p-6 rounded-xl text-slate-400 text-sm">
            Belum ada notifikasi.
          </div>
        )}
        {!loading &&
          !error &&
          visibleFeed.map((item) => {
            const isGeneral = item._isGeneral
            const type = item.type || 'info'
            const isRead = isGeneral
              ? true
              : (item.status || '').toLowerCase() === 'read' || !!item.read_at
            const Icon = getNotificationIcon(type)
            const title = isGeneral ? item.title || 'Update' : getNotificationTitle(type)
            const createdAt = item.created_at
            return (
              <div
                key={item.id}
                className={`
                  relative bg-slate-900/50 border p-4 sm:p-5 md:p-6 rounded-xl backdrop-blur-sm transition-all duration-300
                  ${isRead ? `${getNotificationBorder(type)} opacity-75` : `${getNotificationBorder(type)}`}
                `}
              >
                {/* Unread Indicator */}
                {!isRead && (
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500 animate-pulse" />
                )}

                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Icon */}
                  <div
                    className={`
                      w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0
                      bg-gradient-to-br ${getNotificationColor(type)}
                    `}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-bold mb-1 font-display text-sm sm:text-base ${isRead ? 'text-slate-300' : 'text-white'}`}>
                        {title}
                      </h3>
                      {isGeneral && (
                        <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-cyan-300 border border-cyan-500/30 px-1.5 sm:px-2 py-0.5 rounded-full">
                          General
                        </span>
                      )}
                    </div>
                    <p className={`text-xs sm:text-sm mb-2 ${isRead ? 'text-slate-500' : 'text-slate-400'}`}>
                      {renderContentWithLinks(item.content || '')}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] sm:text-xs text-slate-500">
                        {formatTimeAgo(createdAt)}
                      </span>
                      {!isRead && !isGeneral && (
                        <button
                          className="text-[11px] sm:text-xs text-purple-400 hover:text-purple-300 transition-colors"
                          onClick={() => handleMarkAsRead(item.id)}
                          type="button"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
      </div>

      {!loading && !error && (hasMorePersonal || hasMoreGeneral) && (
        <div className="flex justify-center">
          <button
            className="px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg bg-slate-800/70 text-slate-200 hover:bg-slate-700/70 border border-slate-700"
            onClick={() => {
              if (loadingMore) return
              fetchNotifications(true)
            }}
            type="button"
          >
            {loadingMore ? 'Loading...' : 'Load more'}
          </button>
        </div>
      )}

    </div>
  )
}

export default NotificationContent
