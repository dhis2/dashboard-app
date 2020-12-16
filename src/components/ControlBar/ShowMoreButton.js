import React from 'react'
import PropTypes from 'prop-types'
import { ChevronDown, ChevronUp } from './assets/icons'

import classes from './styles/ShowMoreButton.module.css'

export const SHOWMORE_BAR_HEIGHT = 16

export const ShowMoreButton = ({ onClick, isMaxHeight, disabled }) => {
    return (
        <div className={classes.container}>
            {disabled ? (
                <div className={classes.disabled}>
                    <ChevronDown />
                </div>
            ) : (
                <div
                    className={classes.showMore}
                    onClick={onClick}
                    data-test="showmore-button"
                >
                    {isMaxHeight ? <ChevronUp /> : <ChevronDown />}
                </div>
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
