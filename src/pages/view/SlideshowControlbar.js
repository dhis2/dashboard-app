import {
    IconChevronRight24,
    IconChevronLeft24,
    IconCross24,
    colors,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { SlideshowFiltersInfo } from './SlideshowFiltersInfo.js'
import styles from './styles/SlideshowControlbar.module.css'

const SlideshowControlbar = ({
    slideshowItemIndex,
    exitSlideshow,
    nextItem,
    prevItem,
    numItems,
}) => {
    const navigationDisabled = numItems === 1

    return (
        <div className={styles.container}>
            <div className={styles.start}>
                <button
                    className={styles.squareButton}
                    onClick={exitSlideshow}
                    data-test="slideshow-exit-button"
                >
                    <IconCross24 color={colors.white} />
                </button>
            </div>
            <div className={styles.middle}>
                <div className={styles.controls}>
                    <button
                        className={styles.squareButton}
                        disabled={navigationDisabled}
                        onClick={prevItem}
                        data-test="slideshow-prev-button"
                    >
                        <IconChevronLeft24
                            color={
                                navigationDisabled
                                    ? colors.grey600
                                    : colors.white
                            }
                        />
                    </button>
                    <span
                        className={styles.pageCounter}
                        data-test="slideshow-page-counter"
                    >{`${slideshowItemIndex + 1} / ${numItems}`}</span>
                    <button
                        className={styles.squareButton}
                        disabled={navigationDisabled}
                        onClick={nextItem}
                        data-test="slideshow-next-button"
                    >
                        <IconChevronRight24
                            color={
                                navigationDisabled
                                    ? colors.grey600
                                    : colors.white
                            }
                        />
                    </button>
                </div>
            </div>
            <div className={styles.end}>
                <SlideshowFiltersInfo />
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
