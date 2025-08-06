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
import React, { useState, useRef } from 'react'
import PauseIcon from './slideshow/PauseIcon.jsx'
import PlayIcon from './slideshow/PlayIcon.jsx'
import { SlideshowFiltersInfo } from './SlideshowFiltersInfo.jsx'
import styles from './styles/SlideshowControlbar.module.css'
import { useSlideshowAutoplay, timingOptions } from './useSlideshowAutoplay.js'

const SlideshowControlbar = ({
    slideshowItemIndex,
    exitSlideshow,
    nextItem,
    prevItem,
    numItems,
}) => {
    const [timingOptionsMenuOpen, setTimingOptionsMenuOpen] = useState(false)
    const {
        isPlaying,
        isSlideshowOutdated,
        msPerSlide,
        onTimingChanged,
        onPlayPauseToggled,
    } = useSlideshowAutoplay({ nextItem })

    const timingPopperRef = useRef()

    const navigationEnabled = numItems > 1

    const NextArrow =
        document.dir === 'ltr' ? IconChevronRight24 : IconChevronLeft24
    const PrevArrow =
        document.dir === 'ltr' ? IconChevronLeft24 : IconChevronRight24

    const toggleTimingOptionsMenu = () =>
        setTimingOptionsMenuOpen(!timingOptionsMenuOpen)

    const updateMsPerSlide = ({ value }) => {
        onTimingChanged(value)
        toggleTimingOptionsMenu()
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
                                onClick={onPlayPauseToggled}
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
