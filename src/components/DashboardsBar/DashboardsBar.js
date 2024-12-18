import i18n from '@dhis2/d2-i18n'
import { Button, IconAdd16, DropdownButton } from '@dhis2/ui'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import InformationBlock from './InformationBlock/InformationBlock.js'
import { IconNavigation, NavigationMenu } from './NavigationMenu/index.js'
import styles from './styles/DashboardsBar.module.css'

export const DashboardsBar = () => {
    const history = useHistory()
    const [navigationMenuOpen, setNavigationMenuOpen] = useState(false)

    return (
        <div className={styles.toolbar} data-test="title-bar">
            <div className={styles.blockCreationNavigation}>
                <Button
                    onClick={() => history.push('/new')}
                    secondary
                    small
                    icon={<IconAdd16 />}
                    className={styles.createDashboardButton}
                    dataTest="new-button"
                />
                <DropdownButton
                    dataTest="dashboards-nav-menu-button"
                    icon={<IconNavigation />}
                    secondary
                    small
                    onClick={() => setNavigationMenuOpen((open) => !open)}
                    open={navigationMenuOpen}
                    component={
                        <NavigationMenu
                            close={() => setNavigationMenuOpen(false)}
                        />
                    }
                >
                    <span className={styles.navMenuButtonText}>
                        {i18n.t('Dashboards')}
                    </span>
                </DropdownButton>
            </div>
            <InformationBlock />
        </div>
    )
}
