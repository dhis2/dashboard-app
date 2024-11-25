import i18n from '@dhis2/d2-i18n'
import { Button, IconAdd16, DropdownButton } from '@dhis2/ui'
import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { sGetSelected } from '../../reducers/selected.js'
import InformationBlock from './InformationBlock/InformationBlock.js'
import { IconNavigation, NavigationMenu } from './NavigationMenu/index.js'
import styles from './styles/DashboardsBar.module.css'

export const DashboardsBar = () => {
    const history = useHistory()
    const selectedDashboard = useSelector(sGetSelected)
    console.log(selectedDashboard)
    return (
        <div className={styles.toolbar}>
            <div className={styles.blockCreationNavigation}>
                <Button
                    onClick={() => history.push('/new')}
                    secondary
                    small
                    icon={<IconAdd16 />}
                />
                <DropdownButton
                    icon={<IconNavigation />}
                    secondary
                    small
                    component={<NavigationMenu />}
                >
                    {i18n.t('Dashboards')}
                </DropdownButton>
            </div>
            <InformationBlock />
        </div>
    )
}