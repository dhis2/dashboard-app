import { IconWarningFilled24, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/NoVisualizationMessage.module.css'

const NoVisualizationMessage = ({ message }) => {
    return (
        <p className={classes.container}>
            <span className={classes.icon}>
                <IconWarningFilled24 color={colors.yellow700} />
            </span>
            <span className={classes.message}>{message}</span>
        </p>
    )
}

NoVisualizationMessage.propTypes = {
    message: PropTypes.string,
}

export default NoVisualizationMessage
