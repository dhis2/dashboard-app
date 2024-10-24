import { useDhis2ConnectionStatus, useDataEngine } from '@dhis2/app-runtime'
import { Chip as UiChip, colors, IconStarFilled24 } from '@dhis2/ui'
import cx from 'classnames'
import debounce from 'lodash/debounce.js'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import { apiPostDataStatistics } from '../../api/dataStatistics.js'
import { useCacheableSection } from '../../modules/useCacheableSection.js'
import { OfflineSaved } from './assets/icons.jsx'
import classes from './styles/Chip.module.css'

const Chip = ({ starred, selected, label, dashboardId, onClick }) => {
    const { lastUpdated } = useCacheableSection(dashboardId)
    const { isConnected: online } = useDhis2ConnectionStatus()
    const engine = useDataEngine()
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
        () => apiPostDataStatistics('DASHBOARD_VIEW', dashboardId, engine),
        500
    )

    const handleClick = () => {
        online && debouncedPostStatistics()
        onClick()
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
                {lastUpdated && (
                    <OfflineSaved
                        className={cx(
                            classes.adornment,
                            selected && classes.selected
                        )}
                    />
                )}
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
}

export default Chip
