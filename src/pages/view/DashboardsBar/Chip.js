import { useOnlineStatus, useCacheableSection } from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import { Chip as UiChip, colors, IconStarFilled24 } from '@dhis2/ui'
import cx from 'classnames'
import debounce from 'lodash/debounce'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import { apiPostDataStatistics } from '../../../api/dataStatistics'
import getCacheableSectionId from '../../../modules/getCacheableSectionId'
// import { useCacheableSection } from '../../../modules/useCacheableSection'
import { OfflineSaved } from './assets/icons'
import classes from './styles/Chip.module.css'

const Chip = ({ starred, selected, label, dashboardId, onClick }) => {
    const { d2 } = useD2()
    const cId = getCacheableSectionId(d2.currentUser.id, dashboardId)
    const { lastUpdated } = useCacheableSection(cId)
    const { online } = useOnlineStatus()
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
