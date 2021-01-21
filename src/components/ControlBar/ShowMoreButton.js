import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { Tooltip } from '@dhis2/ui'
import { ChevronDown, ChevronUp } from './assets/icons'

import classes from './styles/ShowMoreButton.module.css'

export const SHOWMORE_BAR_HEIGHT = 16

const ShowMoreButton = ({ onClick, isMaxHeight, disabled }) => {
    const buttonLabel = isMaxHeight
        ? i18n.t('Show fewer dashboards')
        : i18n.t('Show more dashboards')
    return (
        <div className={classes.container}>
            {disabled ? (
                <div className={classes.disabled}>
                    <ChevronDown />
                </div>
            ) : (
                <Tooltip content={buttonLabel} placement="bottom">
                    <button
                        className={classes.showMore}
                        onClick={onClick}
                        data-test="showmore-button"
                        aria-label={buttonLabel}
                    >
                        {isMaxHeight ? <ChevronUp /> : <ChevronDown />}
                    </button>
                </Tooltip>
            )}
        </div>
    )
}

ShowMoreButton.propTypes = {
    disabled: PropTypes.bool,
    isMaxHeight: PropTypes.bool,
    onClick: PropTypes.func,
}

export default ShowMoreButton
