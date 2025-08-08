import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useState, useEffect, useRef } from 'react'
import {
    apiGetUserDataStoreValue,
    apiPostUserDataStoreValue,
} from '../../../api/userDataStore.js'

const FIVE_SECONDS = '5'
const TEN_SECONDS = '10'
const TWENTY_SECONDS = '20'
const THIRTY_SECONDS = '30'
const ONE_MINUTE = '60'
const TWO_MINUTES = '120'

const getTimingOptions = () => ({
    [FIVE_SECONDS]: {
        label: i18n.t('5 seconds per slide'),
        ms: 5000,
    },
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
const DEFAULT_MS_PER_SLIDE = timingOptions[FIVE_SECONDS].ms

const useSlideshowAutoplay = ({ nextItem }) => {
    const dataEngine = useDataEngine()
    const [isPlaying, setIsPlaying] = useState(true)
    const [msPerSlide, setMsPerSlide] = useState(null)
    const [isSlideshowOutdated, setIsSlideshowOutdated] = useState(false)

    // Reference to the timeout that controls the slideshow
    const timeoutRef = useRef(null)

    // Reference to the moment in time when the last slide change occurred
    const slideChangedTimestampRef = useRef(null)

    // Reference to the time remaining for the current slide
    const slideMsRemainingRef = useRef(null)

    // Previous values
    const prevNextItemRef = useRef(null)
    const prevMsPerSlideRef = useRef(null)

    const setSlideMsRemaining = (ms) => {
        slideMsRemainingRef.current = ms
    }

    useEffect(() => {
        const fetchMsPerSlide = async () => {
            let ms
            try {
                const storedMsPerSlide = await apiGetUserDataStoreValue(
                    KEY_SLIDESHOW_MS_PER_SLIDE,
                    DEFAULT_MS_PER_SLIDE,
                    dataEngine
                )
                ms = parseInt(storedMsPerSlide) || DEFAULT_MS_PER_SLIDE
            } catch (e) {
                console.warn('Error fetching slideshow settings', e)
                ms = DEFAULT_MS_PER_SLIDE
            }

            setMsPerSlide(ms)
            setSlideMsRemaining(ms)
        }
        fetchMsPerSlide()
    }, [dataEngine])

    useEffect(() => {
        // Do not start the timer until msPerSlide is set
        if (msPerSlide === null) {
            return
        }
        const msPerSlideChanged = msPerSlide !== prevMsPerSlideRef.current
        const nextItemChanged = nextItem !== prevNextItemRef.current

        if (isPlaying) {
            if (msPerSlideChanged || nextItemChanged) {
                setSlideMsRemaining(msPerSlide)
            }

            timeoutRef.current = setTimeout(() => {
                nextItem()
                slideChangedTimestampRef.current = Date.now()
                setSlideMsRemaining(msPerSlide)
            }, slideMsRemainingRef.current)

            slideChangedTimestampRef.current = Date.now()
        } else {
            timeoutRef.current && clearTimeout(timeoutRef.current)

            if (msPerSlideChanged || nextItemChanged) {
                setSlideMsRemaining(msPerSlide)
            } else {
                const elapsed = Date.now() - slideChangedTimestampRef.current
                setSlideMsRemaining(
                    Math.max(slideMsRemainingRef.current - elapsed, 0)
                )
            }
        }

        prevNextItemRef.current = nextItem
        prevMsPerSlideRef.current = msPerSlide

        return () => timeoutRef.current && clearTimeout(timeoutRef.current)
    }, [isPlaying, msPerSlide, nextItem])

    useEffect(() => {
        const outdatedTimeout = setTimeout(
            () => setIsSlideshowOutdated(true),
            // 24 * 60 * 60 * 1000 // 24 hours
            60 * 1000 // TODO 1 minute for testing
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
    }
}

export { useSlideshowAutoplay, timingOptions }
