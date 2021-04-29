import { useDispatch } from 'react-redux'
import { acSetIsRecording } from '../actions/isRecording'

const CACHE_KEY = 'dhis2.dashboard.cache'

const getDashboardCache = () =>
    JSON.parse(localStorage.getItem(CACHE_KEY)) || {}

const setDashboardCache = cache =>
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))

export const useCacheableSectionStatus = id => {
    const dispatch = useDispatch()

    const updateCache = () => {
        const cached = getDashboardCache()

        const timestamp = new Date(Date.now()).toString()
        const newCache = Object.assign({}, cached, {
            [id]: timestamp,
        })

        setDashboardCache(newCache)
        dispatch(acSetIsRecording(true))
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
        //update - don't expose this?
        //record - re render everything
        //remove
        //pending - getting ready to record
        recording: false, //id === 'JW7RlN5xafN',
    }
}
