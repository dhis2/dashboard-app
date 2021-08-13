import i18n from '@dhis2/d2-i18n'
import { Tooltip, IconStar24, IconStarFilled24, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/StarDashboardButton.module.css'

const StarDashboardButton = ({ starred, onClick }) => {
    const StarIcon = starred ? IconStarFilled24 : IconStar24

    const handleOnClick = () => onClick()

    let tooltipContent
    if (starred) {
        tooltipContent = i18n.t('Unstar dashboard')
    } else {
        tooltipContent = i18n.t('Star dashboard')
    }

    return (
        <button
            className={classes.star}
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
