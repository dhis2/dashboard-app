import i18n from '@dhis2/d2-i18n'
import {
    colors,
    IconChevronLeft24,
    IconChevronRight24,
    IconCross24,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import AutoplayControls from './AutoplayControls.jsx'
import { SlideshowFiltersInfo } from './SlideshowFiltersInfo.jsx'
import styles from './styles/SlideshowControlbar.module.css'

const SlideshowControlbar = ({
    slideshowItemIndex,
    exitSlideshow,
    nextItem,
    prevItem,
    numItems,
}) => {
    const navigationEnabled = numItems > 1

    const NextArrow =
        document.dir === 'ltr' ? IconChevronRight24 : IconChevronLeft24
    const PrevArrow =
        document.dir === 'ltr' ? IconChevronLeft24 : IconChevronRight24

    return (
        <div className={styles.container} data-test="slideshow-controlbar">
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
                {navigationEnabled && <AutoplayControls nextItem={nextItem} />}
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
