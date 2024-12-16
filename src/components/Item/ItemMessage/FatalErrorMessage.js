import { IconWarning24, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/ItemMessage.module.css'

const FatalErrorMessage = ({ message }) => {
    return (
        <div className={classes.messageContent}>
            <IconWarning24 color={colors.grey500} />
            <span>{message}</span>
        </div>
    )
}

FatalErrorMessage.propTypes = {
    message: PropTypes.string,
}

export default FatalErrorMessage
