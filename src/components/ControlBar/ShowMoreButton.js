import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { ChevronDown, ChevronUp } from './assets/icons'

import classes from './styles/ShowMoreButton.module.css'

export const SHOWMORE_BAR_HEIGHT = 16

const ShowMoreButton = ({ onClick, isMaxHeight, disabled }) => {
    return (
        <div className={classes.container}>
            {disabled ? (
                <div className={classes.disabled}>
                    <ChevronDown />
                </div>
            ) : (
                <button
                    className={classes.showMore}
                    onClick={onClick}
                    data-test="showmore-button"
                    aria-label={
                        isMaxHeight ? i18n.t('Show less') : i18n.t('Show more')
                    }
                >
                    {isMaxHeight ? <ChevronUp /> : <ChevronDown />}
                </button>
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
