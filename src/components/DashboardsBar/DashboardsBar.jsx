import PropTypes from 'prop-types'
import React from 'react'
import { CreateDashboardButton } from './CreateDashboardButton/index.js'
import InformationBlock from './InformationBlock/InformationBlock.jsx'
import { NavigationMenuDropdownButton } from './NavigationMenu/index.js'
import styles from './styles/DashboardsBar.module.css'

export const DashboardsBar = ({ hasDashboards }) => (
    <div className={styles.toolbar} data-test="title-bar">
        <div className={styles.creationNavigationBlock}>
            <CreateDashboardButton />
            <NavigationMenuDropdownButton hasDashboards={hasDashboards} />
        </div>
        <InformationBlock />
    </div>
)

DashboardsBar.propTypes = {
    hasDashboards: PropTypes.bool,
}
