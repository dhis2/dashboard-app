import { useDataEngine } from '@dhis2/app-runtime'
import { useCallback, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { acSetRecentDashboards } from '../actions/recentDashboards.js'
import {
    apiGetRecentDashboards,
    apiPostRecentDashboards,
} from '../api/recentDashboards.js'
import {
    RECENT_DASHBOARDS_LIMIT,
    getIdsFromEntries,
    getStoredRecentEntries,
    hasPendingFlush,
    markFlushed,
    storeRecentEntries,
} from './recentDashboards.js'

const FLUSH_INTERVAL_MS = 30000

export const useRecentDashboardsSync = (username) => {
    const engine = useDataEngine()
    const dispatch = useDispatch()
    const isFlushingRef = useRef(false)

    const flushIfPending = useCallback(async () => {
        if (!username || !hasPendingFlush(username) || isFlushingRef.current) {
            return
        }

        isFlushingRef.current = true

        try {
            const entries = getStoredRecentEntries(username)
            // Captured before the request goes out, not after it resolves.
            // Any dashboard opened while the POST is in flight gets a
            // lastOpened AFTER this timestamp, so it still looks pending
            // once markFlushed writes it back and won't be dropped.
            const flushedAt = Date.now()
            const saved = await apiPostRecentDashboards(engine, entries)

            // Only clear the pending-write signal if the write actually landed.
            // Marking a failed flush as flushed would let the next reconcile
            // overwrite local storage with server data that never received it.
            if (saved) {
                markFlushed(username, flushedAt)
            }
        } finally {
            isFlushingRef.current = false
        }
    }, [engine, username])

    // Show the local cache immediately, then reconcile with the server.
    useEffect(() => {
        if (!username) {
            return
        }

        dispatch(
            acSetRecentDashboards(
                getIdsFromEntries(getStoredRecentEntries(username))
            )
        )

        const reconcile = async () => {
            // Unflushed local writes win: push them and keep the local list.
            // This is what protects a session spent offline from being
            // overwritten by a stale server copy on the next app start.
            if (hasPendingFlush(username)) {
                await flushIfPending()
                return
            }

            // Captured before the request goes out, for the same reason as
            // in flushIfPending: an open that lands while this read is in
            // flight must not be mistaken for already-synced.
            const fetchedAt = Date.now()
            const entries = await apiGetRecentDashboards(engine)

            // null means the request failed, as distinct from [] meaning the
            // server genuinely has nothing. Overwriting on a failed read would
            // wipe a good local list every time the app starts offline.
            if (entries === null) {
                return
            }

            // An open landed while the read was in flight; it wins over the
            // server copy.
            if (hasPendingFlush(username)) {
                await flushIfPending()
                return
            }

            // The server copy may have been written by an older client, or
            // by a device with a different clock, so it is not trusted to
            // already be capped or sorted before it lands in local storage.
            const cappedEntries = [...entries]
                .sort((a, b) => b.lastOpened - a.lastOpened)
                .slice(0, RECENT_DASHBOARDS_LIMIT)

            storeRecentEntries(username, cappedEntries)
            markFlushed(username, fetchedAt)

            // Re-read rather than dispatching `entries` directly: storage
            // applies the malformed-entry filter (missing/non-string ids),
            // so this is what keeps a bad server payload from reaching
            // getIdsFromEntries and throwing on destructuring.
            dispatch(
                acSetRecentDashboards(
                    getIdsFromEntries(getStoredRecentEntries(username))
                )
            )
        }

        // Best-effort sync: nothing the user can act on, so failures are
        // swallowed rather than surfaced as an unhandled rejection.
        reconcile().catch(() => {})
    }, [dispatch, engine, flushIfPending, username])

    useEffect(() => {
        const interval = setInterval(flushIfPending, FLUSH_INTERVAL_MS)
        const onVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                flushIfPending()
            }
        }
        // visibilitychange alone is unreliable on mobile Safari when the
        // app is backgrounded or the tab is discarded, so pagehide backs
        // it up. beforeunload is deliberately not used: it behaves worse
        // on iOS and disables the back/forward cache.
        //
        // This flush is opportunistic, not a guarantee: it is an ordinary
        // dataEngine.mutate with no keepalive/sendBeacon, so a real unload
        // can cancel the request in flight. The actual guarantee is that
        // the pending signal survives in local storage regardless, so the
        // next session's reconcile pushes it then.
        const onPageHide = () => {
            flushIfPending()
        }

        document.addEventListener('visibilitychange', onVisibilityChange)
        window.addEventListener('pagehide', onPageHide)

        return () => {
            clearInterval(interval)
            document.removeEventListener('visibilitychange', onVisibilityChange)
            window.removeEventListener('pagehide', onPageHide)
        }
    }, [flushIfPending])
}
