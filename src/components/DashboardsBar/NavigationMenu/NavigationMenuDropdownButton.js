import i18n from '@dhis2/d2-i18n'
import { DropdownButton } from '@dhis2/ui'
import React, { useState } from 'react'
import { IconNavigation } from './IconNavigation.js'
import { NavigationMenu } from './NavigationMenu.js'
import styles from './styles/NavigationMenuDropdownButton.module.css'

export const NavigationMenuDropdownButton = () => {
    const [navigationMenuOpen, setNavigationMenuOpen] = useState(false)

    return (
        <DropdownButton
            dataTest="dashboards-nav-menu-button"
            icon={<IconNavigation />}
            secondary
            small
            onClick={() => setNavigationMenuOpen((open) => !open)}
            open={navigationMenuOpen}
            component={
                <NavigationMenu close={() => setNavigationMenuOpen(false)} />
            }
        >
            <span className={styles.navMenuButtonText}>
                {i18n.t('Dashboards')}
            </span>
        </DropdownButton>
    )
}
