import i18n from '@dhis2/d2-i18n'
import { Layer, Popper } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useMemo, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { sGetNamedItemFilters } from '../../reducers/itemFilters.js'
import styles from './styles/SlideshowFiltersInfo.module.css'

const popperModifiers = [
    {
        name: 'offset',
        options: {
            offset: [0, 8],
        },
    },
]
const FilterSection = ({ name, values }) => (
    <div className={styles.filterSection}>
        <h4 className={styles.filterSectionHeader}>{name}</h4>
        <ul className={styles.filterSectionList}>
            {values.map((value) => (
                <li className={styles.filterSectionListItem} key={value.name}>
                    {value.name}
                </li>
            ))}
        </ul>
    </div>
)

FilterSection.propTypes = {
    name: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })),
}

export const SlideshowFiltersInfo = () => {
    const [isOpen, setIsOpen] = useState(false)
    const ref = useRef(null)
    const filters = useSelector(sGetNamedItemFilters)
    const totalFilterCount = useMemo(
        () =>
            filters.reduce((total, filter) => total + filter.values.length, 0),
        [filters]
    )

    if (filters.length === 0) {
        return null
    }

    return (
        <>
            <button
                ref={ref}
                className={styles.filterButton}
                onClick={() => setIsOpen(true)}
            >
                {i18n.t('{{totalFilterCount}} filters active', {
                    totalFilterCount,
                })}
            </button>
            {isOpen && (
                <Layer disablePortal onClick={() => setIsOpen(false)}>
                    <Popper
                        className={styles.popover}
                        reference={ref}
                        placement="top-end"
                        modifiers={popperModifiers}
                    >
                        {filters.map((filter) => (
                            <FilterSection
                                key={filter.name}
                                name={filter.name}
                                values={filter.values}
                            />
                        ))}
                    </Popper>
                </Layer>
            )}
        </>
    )
}
