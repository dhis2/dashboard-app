import { useCacheableSection } from '@dhis2/app-runtime'
import { Chip as UiChip, colors, IconStarFilled24 } from '@dhis2/ui'
import cx from 'classnames'
import debounce from 'lodash/debounce'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import { apiPostDataStatistics } from '../../../api/dataStatistics'
import { OfflineSaved } from './assets/icons'
import classes from './styles/Chip.module.css'

const Chip = ({ starred, selected, label, dashboardId, onClick }) => {
    const { lastUpdated } = useCacheableSection(dashboardId)
    const chipProps = {
        selected,
    }

    if (starred) {
        chipProps.icon = (
            <IconStarFilled24
                color={selected ? colors.white : colors.grey600}
            />
        )
    }
    const debouncedPostStatistics = debounce(
        () => apiPostDataStatistics('DASHBOARD_VIEW', dashboardId),
        500
    )

    const handleClick = () => {
        debouncedPostStatistics()
        onClick()
    }

    const getAdornment = () => {
        if (!lastUpdated) {
            return null
        }

        return (
            <OfflineSaved
                className={cx(classes.adornment, selected && classes.selected)}
            />
        )
    }

    return (
        <Link
            className={classes.link}
            to={`/${dashboardId}`}
            onClick={handleClick}
            data-test="dashboard-chip"
        >
            <UiChip {...chipProps}>
                <span
                    className={
                        lastUpdated ? classes.labelWithAdornment : undefined
                    }
                >
                    {label}
                </span>
                {getAdornment()}
            </UiChip>
        </Link>
    )
}

Chip.propTypes = {
    dashboardId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    starred: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    cacheVersion: PropTypes.number,
}

export default Chip
