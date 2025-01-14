import React from 'react'
import { CreateDashboardButton } from './CreateDashboardButton.js'
import InformationBlock from './InformationBlock/InformationBlock.js'
import { NavigationMenuDropdownButton } from './NavigationMenu/index.js'
import styles from './styles/DashboardsBar.module.css'

export const DashboardsBar = () => (
    <div className={styles.toolbar} data-test="title-bar">
        <div className={styles.blockCreationNavigation}>
            <CreateDashboardButton />
            <NavigationMenuDropdownButton />
        </div>
        <InformationBlock />
    </div>
)
