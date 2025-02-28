import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Input, Menu } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { EndIntersectionDetector } from './EndIntersectionDetector.js'
import { NavigationMenuItem } from './NavigationMenuItem.js'
import styles from './styles/NavigationMenu.module.css'
import itemStyles from './styles/NavigationMenuItem.module.css'

const dashboardsQuery = {
    resource: 'dashboards',
    params: ({ page, searchTerm }) => {
        return {
            fields: 'id,displayName,favorite~rename(starred)',
            order: 'favorite:desc,displayName:asc',
            filter: searchTerm ? `displayName:ilike:${searchTerm}` : undefined,
            paging: true,
            pageSize: 8,
            page,
        }
    },
}

export const NavigationMenu = ({ close }) => {
    const dataEngine = useDataEngine()
    const [initialDashboardsCount, setInitialDashboardsCount] = useState(null)
    const [dashboards, setDashboards] = useState([])
    const [filterText, setFilterText] = useState('')
    const [page, setPage] = useState(1)

    useEffect(() => {
        const fetchDashboards = async () => {
            const data = await dataEngine.query(
                { dashboards: dashboardsQuery },
                {
                    variables: {
                        page,
                        searchTerm: filterText,
                    },
                }
            )

            const response = {
                dashboards: data.dashboards.dashboards,
                nextPage: data.dashboards.pager.nextPage
                    ? data.dashboards.pager.page + 1
                    : null,
            }

            if (initialDashboardsCount === null) {
                setInitialDashboardsCount(response.dashboards.length)
            }

            setDashboards((currentDashboards) =>
                page > 1
                    ? [...currentDashboards, ...response.dashboards]
                    : response.dashboards
            )

            if (response.nextPage === null) {
                setPage(null)
            }
        }

        if (page !== null) {
            fetchDashboards()
        }
    }, [dataEngine, initialDashboardsCount, page, filterText])

    const onFilterChange = useCallback(({ value }) => {
        setFilterText(value)
        setPage(1)
    }, [])

    const onEndReached = useCallback(() => {
        setPage((prevPage) => (prevPage !== null ? prevPage + 1 : prevPage))
    }, [])

    const scrollBoxRef = useRef(null)

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

    if (initialDashboardsCount === 0) {
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
            {initialDashboardsCount !== null && (
                <div ref={scrollBoxRef} className={styles.scrollbox}>
                    <Menu dense>
                        {dashboards.length === 0 ? (
                            <li className={styles.noItems}>
                                {i18n.t(
                                    'No dashboards found for "{{- filterText}}"',
                                    {
                                        filterText,
                                    }
                                )}
                            </li>
                        ) : (
                            <>
                                {dashboards.map(
                                    ({ displayName, id, starred }) => (
                                        <NavigationMenuItem
                                            displayName={displayName}
                                            id={id}
                                            starred={starred}
                                            key={id}
                                            close={close}
                                        />
                                    )
                                )}
                                <EndIntersectionDetector
                                    key="end-detector"
                                    rootRef={scrollBoxRef}
                                    onEndReached={onEndReached}
                                />
                            </>
                        )}
                    </Menu>
                </div>
            )}
        </div>
    )
}

NavigationMenu.propTypes = {
    close: PropTypes.func.isRequired,
}
