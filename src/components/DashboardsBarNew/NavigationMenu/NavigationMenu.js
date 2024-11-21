import i18n from '@dhis2/d2-i18n'
import { Input, Menu, MenuItem } from '@dhis2/ui'
import React, { useCallback, useMemo, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { acSetDashboardsFilter } from '../../../actions/dashboardsFilter.js'
import { sGetDashboardsSortedByStarred } from '../../../reducers/dashboards.js'
import { sGetDashboardsFilter } from '../../../reducers/dashboardsFilter.js'
import { sGetSelectedId } from '../../../reducers/selected.js'
import { NavigationMenuItemLabel } from './NavigationMenuItemLabel.js'
import styles from './styles/NavigationMenu.module.css'

export const NavigationMenu = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const scrollBoxRef = useRef(null)
    const dashboards = useSelector(sGetDashboardsSortedByStarred)
    const selectedId = useSelector(sGetSelectedId)
    const filterText = useSelector(sGetDashboardsFilter)
    const onFilterChange = useCallback(
        ({ value }) => {
            dispatch(acSetDashboardsFilter(value))
        },
        [dispatch]
    )
    const filteredDashboards = useMemo(
        () =>
            dashboards.filter(
                (dashboard) =>
                    !filterText ||
                    dashboard.displayName
                        .toLowerCase()
                        .includes(filterText.toLowerCase())
            ),
        [filterText, dashboards]
    )

    useEffect(() => {
        scrollBoxRef.current
            .querySelector(`.${styles.selectedItem}`)
            .scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest',
            })
    }, [])

    if (dashboards.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.noDashboardsAvailable}>
                    {i18n.t('No dashboards available')}
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.filterWrap}>
                <Input
                    type="search"
                    placeholder={i18n.t('Search for a dashboard')}
                    value={filterText}
                    onChange={onFilterChange}
                    initialFocus={true}
                />
            </div>
            <div ref={scrollBoxRef} className={styles.scrollbox}>
                <Menu dense>
                    {filteredDashboards.length === 0 ? (
                        <li className={styles.noItems}>
                            {i18n.t('No dashboards found')}
                        </li>
                    ) : (
                        filteredDashboards.map((dashboard) => (
                            <MenuItem
                                onClick={() => {
                                    history.push(`/${dashboard.id}`)
                                }}
                                key={dashboard.id}
                                label={
                                    <NavigationMenuItemLabel
                                        displayName={dashboard.displayName}
                                        availableOffline={true}
                                        starred={dashboard.starred}
                                    />
                                }
                                className={
                                    dashboard.id === selectedId
                                        ? styles.selectedItem
                                        : undefined
                                }
                            />
                        ))
                    )}
                </Menu>
            </div>
        </div>
    )
}
