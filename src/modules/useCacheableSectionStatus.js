const CACHE_KEY = 'dhis2.dashboard.cache'

const getDashboardCache = () =>
    JSON.parse(localStorage.getItem(CACHE_KEY)) || {}

const setDashboardCache = cache =>
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))

export const useCacheableSectionStatus = id => {
    const updateCache = () => {
        const cached = getDashboardCache()

        const timestamp = new Date(Date.now()).toString()
        const newCache = Object.assign({}, cached, {
            [id]: timestamp,
        })

        setDashboardCache(newCache)
    }

    const removeFromCache = () => {
        const cached = getDashboardCache()

        delete cached[id]

        setDashboardCache(cached)
    }

    const getLastUpdated = () => {
        const cached = getDashboardCache()

        return cached[id] || null
    }

    return {
        lastUpdated: getLastUpdated(),
        updateCache,
        removeFromCache,
    }
}
