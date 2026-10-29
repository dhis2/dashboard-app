import i18n from '@dhis2/d2-i18n'
import { IconBlock24, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/ItemMessage.module.css'

const MissingAuthorityMessage = ({ appName }) => (
    <div className={classes.messageContent}>
        <IconBlock24 color={colors.grey500} />
        <span>
            {i18n.t(
                "You don't have access to the {{appName}} app needed to display this item",
                { appName }
            )}
        </span>
        <span>{i18n.t('Contact your system administrator for access')}</span>
    </div>
)

MissingAuthorityMessage.propTypes = {
    appName: PropTypes.string,
}

export default MissingAuthorityMessage
