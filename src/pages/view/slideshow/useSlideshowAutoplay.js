import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useState, useEffect, useCallback, useRef } from 'react'
import {
    apiGetUserDataStoreValue,
    apiPostUserDataStoreValue,
} from '../../../api/userDataStore.js'

const TEN_SECONDS = '10'
const TWENTY_SECONDS = '20'
const THIRTY_SECONDS = '30'
const ONE_MINUTE = '60'
const TWO_MINUTES = '120'

const getTimingOptions = () => ({
    [TEN_SECONDS]: {
        label: i18n.t('10 seconds per slide'),
        ms: 10000,
    },
    [TWENTY_SECONDS]: {
        label: i18n.t('20 seconds per slide'),
        ms: 20000,
    },
    [THIRTY_SECONDS]: {
        label: i18n.t('30 seconds per slide'),
        ms: 30000,
    },
    [ONE_MINUTE]: {
        label: i18n.t('1 minute per slide'),
        ms: 60000,
    },
    [TWO_MINUTES]: {
        label: i18n.t('2 minutes per slide'),
        ms: 120000,
    },
})

const KEY_SLIDESHOW_MS_PER_SLIDE = 'slideshowMsPerSlide'
const timingOptions = getTimingOptions()
const DEFAULT_MS_PER_SLIDE = timingOptions[TEN_SECONDS].ms

const useSlideshowAutoplay = ({ nextItem, itemIndex }) => {
    const dataEngine = useDataEngine()
    const [isPlaying, setIsPlaying] = useState(false)
    const [msPerSlide, setMsPerSlide] = useState(null)
    const [isSlideshowOutdated, setIsSlideshowOutdated] = useState(false)
    const [timerRenderId, setTimerRenderId] = useState(null)

    // Reference to the timer that controls the slideshow
    const timeoutRef = useRef(null)

    // Reference to the moment in time when the last slide change occurred
    const slideChangedTimestampRef = useRef(null)

    // Reference to the time remaining for the current slide
    const slideMsRemainingRef = useRef(null)

    const setSlideMsRemaining = (ms) => (slideMsRemainingRef.current = ms)

    const fetchUserMsPerSlideSetting = useCallback(async () => {
        let ms = DEFAULT_MS_PER_SLIDE
        try {
            const storedMsPerSlide = await apiGetUserDataStoreValue(
                KEY_SLIDESHOW_MS_PER_SLIDE,
                DEFAULT_MS_PER_SLIDE,
                dataEngine
            )
            const intParsedMsPerSlide = Number.parseInt(storedMsPerSlide)
            if (
                !Number.isNaN(intParsedMsPerSlide) &&
                Object.values(timingOptions).some(
                    (option) => option.ms === intParsedMsPerSlide
                )
            ) {
                ms = intParsedMsPerSlide
            }
        } catch (e) {
            console.warn('Error fetching slideshow state', e)
        }

        return ms
    }, [dataEngine])

    useEffect(() => {
        const fetchSetting = async () => {
            const ms = await fetchUserMsPerSlideSetting()
            setMsPerSlide(ms)
            setSlideMsRemaining(ms)
        }
        fetchSetting()
    }, [fetchUserMsPerSlideSetting])

    useEffect(() => {
        if (msPerSlide === null) {
            return
        }
        // User changed slide timing or manually changed the slide,
        // so reset the time remaining and trigger the timer to restart
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
        setSlideMsRemaining(msPerSlide)
        // This is to trigger the timer to advance
        setTimerRenderId((prev) => (prev === null ? 0 : prev + 1))
    }, [msPerSlide, itemIndex])

    useEffect(() => {
        if (timerRenderId === null) {
            return
        }
        if (isPlaying) {
            // Start the timer
            timeoutRef.current = setTimeout(() => {
                nextItem()
                slideChangedTimestampRef.current = Date.now()
            }, slideMsRemainingRef.current)

            slideChangedTimestampRef.current = Date.now()
        } else if (timeoutRef.current) {
            // Slideshow is paused and timer hasn't been cleared yet
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null

            // Calculate the remaining time from the timestamp of the last slide change
            const elapsed = Date.now() - slideChangedTimestampRef.current
            setSlideMsRemaining(
                Math.max(slideMsRemainingRef.current - elapsed, 0)
            )
        }

        return () => timeoutRef.current && clearTimeout(timeoutRef.current)
    }, [isPlaying, nextItem, timerRenderId])

    useEffect(() => {
        const outdatedTimeout = setTimeout(
            () => setIsSlideshowOutdated(true),
            24 * 60 * 60 * 1000 // 24 hours in ms
        )

        return () => clearTimeout(outdatedTimeout)
    }, [])

    const updateMsPerSlide = (value) => {
        setMsPerSlide(timingOptions[value].ms)
        setSlideMsRemaining(timingOptions[value].ms)

        apiPostUserDataStoreValue(
            KEY_SLIDESHOW_MS_PER_SLIDE,
            timingOptions[value].ms,
            dataEngine
        ).catch((e) => {
            console.warn('Error saving slideshow settings', e)
        })
    }

    const togglePlayPause = () => setIsPlaying((prev) => !prev)

    return {
        isPlaying,
        isSlideshowOutdated,
        msPerSlide,
        onTimingChanged: updateMsPerSlide,
        onPlayPauseToggled: togglePlayPause,
        slideMsRemaining: slideMsRemainingRef.current,
    }
}

export { useSlideshowAutoplay, getTimingOptions }
