import {
    IconChevronRight24,
    IconChevronLeft24,
    IconCross24,
    colors,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/SlideshowControlbar.module.css'

const SlideshowControlbar = ({
    slideshowItemIndex,
    exitSlideshow,
    nextItem,
    prevItem,
    numItems,
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.controls}>
                <button
                    className={styles.exitButton}
                    onClick={exitSlideshow}
                    data-test="slideshow-exit-button"
                >
                    <IconCross24 color={colors.white} />
                </button>
                <button onClick={prevItem}>
                    <IconChevronLeft24 color={colors.white} />
                </button>
                <span className={styles.pageCounter}>{`${
                    slideshowItemIndex + 1
                } / ${numItems}`}</span>
                <button onClick={nextItem}>
                    <IconChevronRight24 color={colors.white} />
                </button>
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
