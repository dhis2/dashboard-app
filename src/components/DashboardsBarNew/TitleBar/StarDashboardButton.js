import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Tooltip, IconStar24, IconStarFilled24, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/StarDashboardButton.module.css'

const StarDashboardButton = ({ starred, onClick }) => {
    const { isConnected: online } = useDhis2ConnectionStatus()

    const StarIcon = starred ? IconStarFilled24 : IconStar24

    const handleOnClick = () => {
        online && onClick()
    }

    let tooltipContent
    if (online) {
        if (starred) {
            tooltipContent = i18n.t('Unstar dashboard')
        } else {
            tooltipContent = i18n.t('Star dashboard')
        }
    } else {
        if (starred) {
            tooltipContent = i18n.t(
                'Cannot unstar this dashboard while offline'
            )
        } else {
            tooltipContent = i18n.t('Cannot star this dashboard while offline')
        }
    }

    return (
        <button
            className={classes.star}
            disabled={!online}
            onClick={handleOnClick}
            data-test="button-star-dashboard"
        >
            <Tooltip content={tooltipContent}>
                <span
                    data-test={
                        starred ? 'dashboard-starred' : 'dashboard-unstarred'
                    }
                >
                    <StarIcon color={colors.grey600} />
                </span>
            </Tooltip>
        </button>
    )
}

StarDashboardButton.propTypes = {
    starred: PropTypes.bool,
    onClick: PropTypes.func,
}

StarDashboardButton.defaultProps = {
    onClick: Function.prototype,
}

export default StarDashboardButton
