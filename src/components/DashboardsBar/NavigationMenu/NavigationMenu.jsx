import i18n from '@dhis2/d2-i18n'
import { Input, Menu, Tab, TabBar } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { acSetDashboardsFilter } from '../../../actions/dashboardsFilter.js'
import { tRemoveRecentDashboard } from '../../../actions/recentDashboards.js'
import { getDashboardsForTab } from '../../../modules/getDashboardsForTab.js'
import {
    getNavigationTab,
    storeNavigationTab,
} from '../../../modules/localStorage.js'
import { NAV_TABS } from '../../../modules/navigationTabs.js'
import { sGetDashboardsSortedByStarred } from '../../../reducers/dashboards.js'
import { sGetDashboardsFilter } from '../../../reducers/dashboardsFilter.js'
import { sGetRecentDashboardIds } from '../../../reducers/recentDashboards.js'
import { useCurrentUser } from '../../AppDataProvider/AppDataProvider.jsx'
import { NavigationMenuItem } from './NavigationMenuItem.jsx'
import styles from './styles/NavigationMenu.module.css'
import itemStyles from './styles/NavigationMenuItem.module.css'

const matchesFilter = (dashboard, filterText) =>
    !filterText ||
    dashboard.displayName.toLowerCase().includes(filterText.toLowerCase())

const getEmptyTabMessage = (tab) => {
    switch (tab) {
        case NAV_TABS.STARRED:
            return i18n.t(
                'You have not starred any dashboards yet. Star one from its header, or browse All.'
            )
        case NAV_TABS.MINE:
            return i18n.t('You have not created any dashboards.')
        case NAV_TABS.RECENT:
            return i18n.t('Dashboards you open will appear here.')
        default:
            return i18n.t('No dashboards available.')
    }
}

export const NavigationMenu = ({ close }) => {
    const dispatch = useDispatch()
    const scrollBoxRef = useRef(null)
    const currentUser = useCurrentUser()
    const dashboards = useSelector(sGetDashboardsSortedByStarred)
    const filterText = useSelector(sGetDashboardsFilter)
    const recentIds = useSelector(sGetRecentDashboardIds)
    const [tab, setTab] = useState(() => getNavigationTab(currentUser.username))

    const onTabClick = useCallback(
        (nextTab) => {
            setTab(nextTab)
            storeNavigationTab(currentUser.username, nextTab)
        },
        [currentUser.username]
    )

    const onFilterChange = useCallback(
        ({ value }) => {
            dispatch(acSetDashboardsFilter(value))
        },
        [dispatch]
    )

    const onRemoveRecent = useCallback(
        (id) => {
            dispatch(tRemoveRecentDashboard(currentUser.username, id))
        },
        [dispatch, currentUser.username]
    )

    const tabDashboards = useMemo(
        () =>
            getDashboardsForTab({
                dashboards,
                tab,
                currentUserId: currentUser.id,
                recentIds,
            }),
        [dashboards, tab, currentUser.id, recentIds]
    )

    const filteredDashboards = useMemo(
        () =>
            tabDashboards.filter((dashboard) =>
                matchesFilter(dashboard, filterText)
            ),
        [filterText, tabDashboards]
    )

    const otherMatchCount = useMemo(() => {
        if (tab === NAV_TABS.ALL || !filterText) {
            return 0
        }

        const tabIds = new Set(tabDashboards.map(({ id }) => id))

        return dashboards.filter(
            (dashboard) =>
                !tabIds.has(dashboard.id) &&
                matchesFilter(dashboard, filterText)
        ).length
    }, [dashboards, tabDashboards, tab, filterText])

    useEffect(() => {
        scrollBoxRef.current
            ?.getElementsByClassName(itemStyles.selectedItem)
            ?.item(0)
            ?.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest',
            })
    }, [])

    if (dashboards.length === 0) {
        return (
            <div className={cx(styles.container, styles.noDashboardsAvailable)}>
                <p>{i18n.t('No dashboards available.')}</p>
                <p>{i18n.t('Create a new dashboard using the + button.')}</p>
            </div>
        )
    }

    const renderList = () => {
        if (tabDashboards.length === 0) {
            return <li className={styles.noItems}>{getEmptyTabMessage(tab)}</li>
        }

        if (filteredDashboards.length === 0) {
            return (
                <li className={styles.noItems}>
                    {i18n.t('No dashboards found for "{{- filterText}}"', {
                        filterText,
                    })}
                </li>
            )
        }

        return filteredDashboards.map(({ displayName, id, starred }) => (
            <NavigationMenuItem
                displayName={displayName}
                id={id}
                starred={starred}
                key={id}
                close={close}
                onRemove={tab === NAV_TABS.RECENT ? onRemoveRecent : undefined}
            />
        ))
    }

    return (
        <div className={styles.container}>
            <div className={styles.tabWrap}>
                <TabBar scrollable>
                    <Tab
                        selected={tab === NAV_TABS.ALL}
                        onClick={() => onTabClick(NAV_TABS.ALL)}
                    >
                        {i18n.t('All')}
                    </Tab>
                    <Tab
                        selected={tab === NAV_TABS.STARRED}
                        onClick={() => onTabClick(NAV_TABS.STARRED)}
                    >
                        {i18n.t('Starred')}
                    </Tab>
                    <Tab
                        selected={tab === NAV_TABS.MINE}
                        onClick={() => onTabClick(NAV_TABS.MINE)}
                    >
                        {i18n.t('Mine')}
                    </Tab>
                    <Tab
                        selected={tab === NAV_TABS.RECENT}
                        onClick={() => onTabClick(NAV_TABS.RECENT)}
                    >
                        {i18n.t('Recent')}
                    </Tab>
                </TabBar>
            </div>
            <div className={styles.filterWrap}>
                <Input
                    dense
                    type="search"
                    placeholder={i18n.t('Search for a dashboard')}
                    value={filterText}
                    onChange={onFilterChange}
                    initialFocus={true}
                />
            </div>
            <div
                ref={scrollBoxRef}
                className={styles.scrollbox}
                role="tabpanel"
                aria-label={i18n.t('Dashboards')}
            >
                {/*
                    Key forces a remount (resetting @dhis2/ui's internal
                    activeItemIndex) whenever the rendered list shrinks —
                    either because the Recent list itself shrinks, or
                    because typing in the search box filters the list on
                    any tab. Without it, useMenuNavigation can leave focus
                    pointing past the end of the list and crash on the next
                    arrow-key press.
                */}
                <Menu dense key={`${tab}:${filteredDashboards.length}`}>

                    {renderList()}
                </Menu>
            </div>
            {otherMatchCount > 0 && (
                <button
                    type="button"
                    className={styles.otherMatches}
                    onClick={() => onTabClick(NAV_TABS.ALL)}
                >
                    {i18n.t('{{count}} more in All dashboards', {
                        count: otherMatchCount,
                    })}
                </button>
            )}
        </div>
    )
}

NavigationMenu.propTypes = {
    close: PropTypes.func.isRequired,
}
