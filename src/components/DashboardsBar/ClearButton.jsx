import PropTypes from 'prop-types'
import React from 'react'
import ClearIcon from './assets/Clear.jsx'
import classes from './styles/ClearButton.module.css'

const ClearButton = ({ onClear }) => (
    <button className={classes.button} onClick={onClear}>
        <span>
            <ClearIcon className={classes.icon} color="action" />
        </span>
    </button>
)

ClearButton.propTypes = {
    onClear: PropTypes.func.isRequired,
}

export default ClearButton
