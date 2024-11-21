import { IconDownload16, IconStarFilled16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/DashboardMenuItemLabel.module.css'

export const DashboardMenuItemLabel = ({
    displayName,
    starred,
    availableOffline,
}) => {
    return (
        <span className={styles.container}>
            {starred && <IconStarFilled16 />}
            <span style={styles.displayname}>{displayName}</span>
            {availableOffline && <IconDownload16 />}
        </span>
    )
}

DashboardMenuItemLabel.propTypes = {
    displayName: PropTypes.string.isRequired,
    availableOffline: PropTypes.bool,
    starred: PropTypes.bool,
}
