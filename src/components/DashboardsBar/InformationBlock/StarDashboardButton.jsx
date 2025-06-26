import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Tooltip, IconStar16, IconStarFilled16, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/StarDashboardButton.module.css'

const StarDashboardButton = ({ starred, onClick }) => {
    const { isConnected: online } = useDhis2ConnectionStatus()

    const StarIcon = starred ? IconStarFilled16 : IconStar16

    const handleOnClick = () => {
        online && onClick()
    }

    let tooltipContent
    if (online) {
        tooltipContent = starred
            ? i18n.t('Unstar dashboard')
            : i18n.t('Star dashboard')
    } else {
        tooltipContent = starred
            ? i18n.t('Cannot unstar this dashboard while offline')
            : i18n.t('Cannot star this dashboard while offline')
    }

    return (
        <Tooltip content={tooltipContent}>
            {({ onMouseOver, onMouseOut, onFocus, onBlur, ref }) => (
                <button
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
                    onFocus={onFocus.onFocus}
                    onBlur={onBlur.onBlur}
                    ref={ref}
                    data-test={
                        starred ? 'dashboard-starred' : 'dashboard-unstarred'
                    }
                    className={classes.star}
                    disabled={!online}
                    onClick={handleOnClick}
                >
                    <StarIcon color={colors.grey600} />
                </button>
            )}
        </Tooltip>
    )
}

StarDashboardButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    starred: PropTypes.bool,
}

export default StarDashboardButton
