import i18n from '@dhis2/d2-i18n'
import {
    IconChevronRight24,
    IconChevronLeft24,
    IconCross24,
    colors,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useSelector } from 'react-redux'
import { sGetNamedItemFilters } from '../../reducers/itemFilters.js'
import styles from './styles/SlideshowControlbar.module.css'

const getFilterText = (filter) => {
    return `${filter.name}: ${
        filter.values.length > 1
            ? i18n.t('{{count}} selected', {
                  count: filter.values.length,
              })
            : filter.values[0].name
    }`
}

const SlideshowControlbar = ({
    slideshowItemIndex,
    exitSlideshow,
    nextItem,
    prevItem,
    numItems,
}) => {
    const filters = useSelector(sGetNamedItemFilters)
    const navigationDisabled = numItems === 1

    return (
        <div className={styles.container}>
            <div>
                <button
                    onClick={exitSlideshow}
                    data-test="slideshow-exit-button"
                >
                    <IconCross24 color={colors.white} />
                </button>
            </div>
            <div className={styles.controls}>
                <button
                    disabled={navigationDisabled}
                    onClick={prevItem}
                    data-test="slideshow-prev-button"
                >
                    <IconChevronLeft24
                        color={
                            navigationDisabled ? colors.grey600 : colors.white
                        }
                    />
                </button>
                <span
                    className={styles.pageCounter}
                    data-test="slideshow-page-counter"
                >{`${slideshowItemIndex + 1} / ${numItems}`}</span>
                <button
                    disabled={navigationDisabled}
                    onClick={nextItem}
                    data-test="slideshow-next-button"
                >
                    <IconChevronRight24
                        color={
                            navigationDisabled ? colors.grey600 : colors.white
                        }
                    />
                </button>
            </div>
            <ul className={styles.filters}>
                {filters.map((filter) => (
                    <li key={filter.id} className={styles.filter}>
                        {getFilterText(filter)}
                    </li>
                ))}
            </ul>
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
