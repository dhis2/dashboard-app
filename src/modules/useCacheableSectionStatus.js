import { useDispatch } from 'react-redux'
import { acSetIsRecording } from '../actions/isRecording'
import { acIncrementCacheVersion } from '../actions/cacheVersion'

const CACHE_KEY = 'dhis2.dashboard.cache'

const getDashboardCache = () =>
    JSON.parse(localStorage.getItem(CACHE_KEY)) || {}

const setDashboardCache = cache =>
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))

export const useCacheableSectionStatus = id => {
    const dispatch = useDispatch()

    const updateCache = () => {
        console.log('updateCache')
        const cached = getDashboardCache()

        const timestamp = new Date(Date.now()).toString()
        const newCache = Object.assign({}, cached, {
            [id]: timestamp,
        })

        setDashboardCache(newCache)
        dispatch(acSetIsRecording(true))
        dispatch(acIncrementCacheVersion())
    }

    const removeFromCache = () => {
        console.log('removeFromCache')
        const cached = getDashboardCache()

        delete cached[id]

        setDashboardCache(cached)
        dispatch(acIncrementCacheVersion())
    }

    const getLastUpdated = () => {
        const cached = getDashboardCache()

        return cached[id] || null
    }

    return {
        lastUpdated: getLastUpdated(),
        updateCache, //record - re render everything
        removeFromCache, //remove
        recording: id === 'juY8oe5lg4g',
        //pending - getting ready to record
        //update - don't expose this?
    }
}
