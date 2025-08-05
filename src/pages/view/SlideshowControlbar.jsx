import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    colors,
    IconCheckmark24,
    IconChevronLeft24,
    IconChevronRight24,
    IconCross24,
    IconInfo24,
    IconMore24,
    Layer,
    Menu,
    MenuItem,
    Popper,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useRef } from 'react'
import {
    apiGetUserDataStoreValue,
    apiPostUserDataStoreValue,
} from '../../api/userDataStore.js'
import PauseIcon from './slideshow/PauseIcon.jsx'
import PlayIcon from './slideshow/PlayIcon.jsx'
import { SlideshowFiltersInfo } from './SlideshowFiltersInfo.jsx'
import styles from './styles/SlideshowControlbar.module.css'

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

const SlideshowControlbar = ({
    slideshowItemIndex,
    exitSlideshow,
    nextItem,
    prevItem,
    numItems,
}) => {
    const dataEngine = useDataEngine()
    const [isPlaying, setIsPlaying] = useState(true)
    const [msPerSlide, setMsPerSlide] = useState(null)
    const [isSlideshowOutdated, setIsSlideshowOutdated] = useState(false)
    const [timingOptionsMenuOpen, setTimingOptionsMenuOpen] = useState(false)

    // For positioning the timing options pop-up
    const timingPopperRef = useRef()

    // Reference to the timeout that controls the slideshow
    const timeoutRef = useRef(null)

    // Reference to the moment in time when the last slide change occurred
    const slideChangedTimestampRef = useRef(null)

    // Reference to the time remaining for the current slide
    const slideTimeRemainingRef = useRef(null)

    // track previous state
    const prevNextItemRef = useRef(null)
    const prevMsPerSlideRef = useRef(null)

    const navigationEnabled = numItems > 1

    const setSlideTimeRemaining = (ms) => {
        slideTimeRemainingRef.current = ms
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
            setSlideTimeRemaining(ms)
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
                setSlideTimeRemaining(msPerSlide)
            }

            timeoutRef.current = setTimeout(() => {
                nextItem()
                slideChangedTimestampRef.current = Date.now()
                setSlideTimeRemaining(msPerSlide)
            }, slideTimeRemainingRef.current)

            slideChangedTimestampRef.current = Date.now()
        } else {
            timeoutRef.current && clearTimeout(timeoutRef.current)

            if (msPerSlideChanged || nextItemChanged) {
                setSlideTimeRemaining(msPerSlide)
            } else {
                const elapsed = Date.now() - slideChangedTimestampRef.current
                setSlideTimeRemaining(
                    Math.max(slideTimeRemainingRef.current - elapsed, 0)
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

    if (msPerSlide === null) {
        return null
    }

    const NextArrow =
        document.dir === 'ltr' ? IconChevronRight24 : IconChevronLeft24
    const PrevArrow =
        document.dir === 'ltr' ? IconChevronLeft24 : IconChevronRight24

    const toggleIsPlaying = () => {
        setIsPlaying(!isPlaying)
    }

    const toggleTimingOptionsMenu = () => {
        setTimingOptionsMenuOpen(!timingOptionsMenuOpen)
    }

    const updateMsPerSlide = ({ value }) => {
        setMsPerSlide(timingOptions[value].ms)
        setSlideTimeRemaining(timingOptions[value].ms)
        toggleTimingOptionsMenu()

        try {
            apiPostUserDataStoreValue(
                KEY_SLIDESHOW_MS_PER_SLIDE,
                timingOptions[value].ms,
                dataEngine
            )
        } catch (e) {
            console.warn('Error saving slideshow settings', e)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.start}>
                <button
                    className={styles.button}
                    onClick={exitSlideshow}
                    aria-label={i18n.t('Exit slideshow')}
                    data-test="slideshow-exit-button"
                >
                    <IconCross24 color={colors.white} />
                </button>
            </div>
            <div className={styles.middle}>
                <div className={styles.controls}>
                    <button
                        className={styles.button}
                        disabled={!navigationEnabled}
                        onClick={prevItem}
                        aria-label={i18n.t('Previous item')}
                        data-test="slideshow-prev-button"
                    >
                        <PrevArrow
                            color={
                                navigationEnabled
                                    ? colors.white
                                    : colors.grey600
                            }
                        />
                    </button>
                    <span
                        className={styles.pageCounter}
                        data-test="slideshow-page-counter"
                        dir="ltr"
                    >{`${slideshowItemIndex + 1} / ${numItems}`}</span>
                    <button
                        className={styles.button}
                        disabled={!navigationEnabled}
                        onClick={nextItem}
                        aria-label={i18n.t('Next item')}
                        data-test="slideshow-next-button"
                    >
                        <NextArrow
                            color={
                                navigationEnabled
                                    ? colors.white
                                    : colors.grey600
                            }
                        />
                    </button>
                </div>
            </div>
            <div className={styles.end}>
                <SlideshowFiltersInfo />
                <div className={styles.autoplayControls}>
                    {isSlideshowOutdated && (
                        <div className={styles.outdatedMessage}>
                            <span>
                                <IconInfo24 />
                            </span>
                            <span>
                                {i18n.t('Slideshow started over 24 hours ago')}
                            </span>
                        </div>
                    )}
                    {navigationEnabled && (
                        <>
                            <button
                                ref={timingPopperRef}
                                className={styles.button}
                                onClick={toggleTimingOptionsMenu}
                            >
                                <IconMore24 />
                            </button>
                            <button
                                className={styles.button}
                                onClick={toggleIsPlaying}
                            >
                                {isPlaying ? <PauseIcon /> : <PlayIcon />}
                            </button>
                        </>
                    )}
                    {timingOptionsMenuOpen && (
                        <Layer
                            disablePortal
                            onBackdropClick={toggleTimingOptionsMenu}
                        >
                            <Popper
                                className={styles.popover}
                                reference={timingPopperRef}
                                placement="top-end"
                            >
                                <Menu dense>
                                    {Object.entries(timingOptions).map(
                                        ([key, value]) => {
                                            return (
                                                <MenuItem
                                                    className={cx(
                                                        styles.menuItem,
                                                        {
                                                            [styles.unselectedMenuItem]:
                                                                msPerSlide !==
                                                                value.ms,
                                                        }
                                                    )}
                                                    key={`item-${key}`}
                                                    label={value.label}
                                                    value={key}
                                                    onClick={updateMsPerSlide}
                                                    active={
                                                        msPerSlide === value.ms
                                                    }
                                                    icon={
                                                        <IconCheckmark24
                                                            color={
                                                                colors.green700
                                                            }
                                                        />
                                                    }
                                                />
                                            )
                                        }
                                    )}
                                </Menu>
                            </Popper>
                        </Layer>
                    )}
                </div>
            </div>
        </div>
    )
}

SlideshowControlbar.propTypes = {
    exitSlideshow: PropTypes.func.isRequired,
    nextItem: PropTypes.func.isRequired,
    numItems: PropTypes.number.isRequired,
    prevItem: PropTypes.func.isRequired,
    slideshowItemIndex: PropTypes.number.isRequired,
}

export default SlideshowControlbar
