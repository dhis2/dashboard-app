import React from 'react'
import PropTypes from 'prop-types'
import { Chip } from '@dhis2/ui-core'
import { Link } from 'react-router-dom'
import debounce from 'lodash/debounce'

import StarIcon from '../../icons/Star'
import { apiPostDataStatistics } from '../../api/dataStatistics'

import classes from './styles/DashboardItemChip.module.css'

export const DashboardItemChip = ({
    starred,
    selected,
    label,
    dashboardId,
}) => {
    const chipProps = {
        selected,
    }

    if (starred) {
        const selectedState = selected ? classes.selected : classes.unselected
        chipProps.icon = (
            <StarIcon className={`${classes.icon} ${selectedState}`} />
        )
    }

    return (
        <Link
            className={classes.link}
            to={`/${dashboardId}`}
            onClick={debounce(
                () => apiPostDataStatistics('DASHBOARD_VIEW', dashboardId),
                500
            )}
        >
            <Chip {...chipProps}>{label}</Chip>
        </Link>
    )
}

DashboardItemChip.propTypes = {
    dashboardId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    starred: PropTypes.bool.isRequired,
    classes: PropTypes.object,
}

export default DashboardItemChip
