import i18n from '@dhis2/d2-i18n'
import {
    Button,
    IconAdd16,
    IconStar16,
    // IconStarFilled16,
    IconFilter16,
    IconMore16,
    DropdownButton,
    Tag,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { sGetSelected } from '../../reducers/selected.js'
import InformationBlock from './InformationBlock/InformationBlock.js'
import { IconNavigation, NavigationMenu } from './NavigationMenu/index.js'
import styles from './styles/DashboardsBar.module.css'

export const DashboardsBar = ({ external, offline }) => {
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
            <div className={styles.blockInformation}>
                <div className={styles.informationTitle}>
                    <span className={styles.dashboardTitle}>
                        {selectedDashboard.displayName}
                    </span>
                    <button className={styles.actionButtonStar}>
                        <IconStar16 />
                    </button>
                    <div className={styles.tagContainer}>
                        {offline && <Tag>Synced 3 weeks ago</Tag>}
                        {external && <Tag>External data</Tag>}
                    </div>
                </div>
                <div className={styles.informationActions}>
                    <Button secondary small>
                        Edit
                    </Button>
                    <Button secondary small>
                        Share
                    </Button>
                    <Button secondary small>
                        Slideshow
                    </Button>
                    <DropdownButton secondary small icon={<IconFilter16 />}>
                        Filter
                    </DropdownButton>
                    <DropdownButton secondary small icon={<IconMore16 />} />
                </div>
            </div>
        </div>
    )
}

DashboardsBar.propTypes = {
    external: PropTypes.bool,
    offline: PropTypes.bool,
}
