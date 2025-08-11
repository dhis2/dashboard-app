import i18n from '@dhis2/d2-i18n'
import {
    colors,
    IconCheckmark24,
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
import PauseIcon from './PauseIcon.jsx'
import PlayIcon from './PlayIcon.jsx'
import styles from './styles/SlideshowControlbar.module.css'
import {
    useSlideshowAutoplay,
    getTimingOptions,
} from './useSlideshowAutoplay.js'

const AutoplayControls = ({ nextItem }) => {
    const [timingOptionsMenuOpen, setTimingOptionsMenuOpen] = useState(false)
    const {
        isPlaying,
        isSlideshowOutdated,
        msPerSlide,
        onTimingChanged,
        onPlayPauseToggled,
    } = useSlideshowAutoplay({ nextItem })

    const timingPopperRef = useRef()

    const toggleTimingOptionsMenu = () =>
        setTimingOptionsMenuOpen(!timingOptionsMenuOpen)

    const updateMsPerSlide = ({ value }) => {
        onTimingChanged(value)
        toggleTimingOptionsMenu()
    }

    return (
        <div className={styles.autoplayControls}>
            {isSlideshowOutdated && (
                <div className={styles.outdatedMessage}>
                    <span>
                        <IconInfo24 />
                    </span>
                    <span>{i18n.t('Slideshow started over 24 hours ago')}</span>
                </div>
            )}
            <button
                ref={timingPopperRef}
                className={styles.button}
                data-test="slideshow-autoplay-settings-button"
                onClick={toggleTimingOptionsMenu}
            >
                <IconMore24 />
            </button>
            <button
                className={styles.button}
                onClick={onPlayPauseToggled}
                data-test="slideshow-autoplay-play-pause-button"
            >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            {timingOptionsMenuOpen && (
                <Layer disablePortal onBackdropClick={toggleTimingOptionsMenu}>
                    <Popper
                        className={styles.autoplaySettingsPopper}
                        reference={timingPopperRef}
                        placement="top-end"
                    >
                        <Menu dense>
                            {Object.entries(getTimingOptions()).map(
                                ([key, value]) => (
                                    <MenuItem
                                        className={cx(styles.menuItem, {
                                            [styles.unselectedMenuItem]:
                                                msPerSlide !== value.ms,
                                            [styles.selectedMenuItem]:
                                                msPerSlide === value.ms,
                                        })}
                                        key={`item-${key}`}
                                        label={value.label}
                                        value={key}
                                        onClick={updateMsPerSlide}
                                        active={msPerSlide === value.ms}
                                        icon={
                                            <IconCheckmark24
                                                color={colors.green700}
                                            />
                                        }
                                    />
                                )
                            )}
                        </Menu>
                    </Popper>
                </Layer>
            )}
        </div>
    )
}

AutoplayControls.propTypes = {
    nextItem: PropTypes.func.isRequired,
}

export default AutoplayControls
