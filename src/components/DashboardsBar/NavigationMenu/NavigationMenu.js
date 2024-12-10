import i18n from '@dhis2/d2-i18n'
import { Input, Menu } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useCallback, useMemo, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { acSetDashboardsFilter } from '../../../actions/dashboardsFilter.js'
import { sGetDashboardsSortedByStarred } from '../../../reducers/dashboards.js'
import { sGetDashboardsFilter } from '../../../reducers/dashboardsFilter.js'
import { NavigationMenuItem } from './NavigationMenuItem.js'
import styles from './styles/NavigationMenu.module.css'

export const NavigationMenu = ({ close }) => {
    const dispatch = useDispatch()
    const scrollBoxRef = useRef(null)
    const dashboards = useSelector(sGetDashboardsSortedByStarred)
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
            ?.getElementsByClassName(styles.selectedItem)
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

    return (
        <div className={styles.container}>
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
            <div ref={scrollBoxRef} className={styles.scrollbox}>
                <Menu dense>
                    {filteredDashboards.length === 0 ? (
                        <li role="listitem" className={styles.noItems}>
                            {i18n.t('No dashboards found')}
                        </li>
                    ) : (
                        filteredDashboards.map(
                            ({ displayName, id, starred }) => (
                                <NavigationMenuItem
                                    displayName={displayName}
                                    id={id}
                                    starred={starred}
                                    key={id}
                                    close={close}
                                />
                            )
                        )
                    )}
                </Menu>
            </div>
        </div>
    )
}
NavigationMenu.propTypes = {
    close: PropTypes.func.isRequired,
}
