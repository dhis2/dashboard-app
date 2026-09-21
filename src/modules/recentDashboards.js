export const RECENT_DASHBOARDS_LIMIT = 20

export const getIdsFromEntries = (entries) => entries.map(({ id }) => id)

export const addRecentEntry = (entries, id, now) =>
    [
        { id, lastOpened: now },
        ...entries.filter((entry) => entry.id !== id),
    ].slice(0, RECENT_DASHBOARDS_LIMIT)

export const removeRecentEntry = (entries, id) =>
    entries.filter((entry) => entry.id !== id)

const recentKey = (username) => `dhis2.dashboard.recent.${username}`

const readStored = (username) => {
    try {
        const stored = JSON.parse(localStorage.getItem(recentKey(username)))

        return Array.isArray(stored?.entries)
            ? {
                  entries: stored.entries.filter(
                      (entry) => entry && typeof entry.id === 'string'
                  ),
                  lastFlushed: stored.lastFlushed || 0,
                  dirty: stored.dirty === true,
              }
            : { entries: [], lastFlushed: 0, dirty: false }
    } catch (error) {
        return { entries: [], lastFlushed: 0, dirty: false }
    }
}

export const getStoredRecentEntries = (username) => readStored(username).entries

export const storeRecentEntries = (username, entries) => {
    const { lastFlushed } = readStored(username)

    try {
        localStorage.setItem(
            recentKey(username),
            JSON.stringify({ entries, lastFlushed, dirty: true })
        )
    } catch (error) {
        console.info('Failed to store recent dashboards', error)
    }
}

// Dirtiness is tracked explicitly rather than inferred from timestamps: a
// removal only shrinks the entries array, so it never produces an entry
// with a newer lastOpened than lastFlushed. Inferring "pending" from
// lastOpened > lastFlushed would silently miss every removal.
export const hasPendingFlush = (username) => readStored(username).dirty

export const markFlushed = (username, now = Date.now()) => {
    const { entries } = readStored(username)

    try {
        localStorage.setItem(
            recentKey(username),
            JSON.stringify({ entries, lastFlushed: now, dirty: false })
        )
    } catch (error) {
        console.info('Failed to mark recent dashboards as flushed', error)
    }
}
