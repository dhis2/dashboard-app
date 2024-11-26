import { useCacheableSection } from '@dhis2/app-runtime'
import { IconStarFilled16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { IconOfflineSaved } from './IconOfflineSaved.js'
import styles from './styles/NavigationMenuItemLabel.module.css'

export const NavigationMenuItemLabel = ({ displayName, id, starred }) => {
    const { lastUpdated } = useCacheableSection(id)

    return (
        <span className={styles.container}>
            {starred && <IconStarFilled16 />}
            <span style={styles.displayname}>{displayName}</span>
            {!!lastUpdated && <IconOfflineSaved />}
        </span>
    )
}

NavigationMenuItemLabel.propTypes = {
    displayName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    starred: PropTypes.bool,
}
