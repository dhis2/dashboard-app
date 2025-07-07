import { Cover, IconWarning24, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/Visualization.module.css'

export const PluginWarningMessage = ({ style, message }) => (
    <div style={style}>
        <Cover>
            <div className={classes.messageContent}>
                <IconWarning24 color={colors.grey500} />
                {message}
            </div>
        </Cover>
    </div>
)

PluginWarningMessage.propTypes = {
    message: PropTypes.string,
    style: PropTypes.object,
}
