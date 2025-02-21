import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Menu, Input } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect, useCallback, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetDashboardsFilter } from '../../../actions/dashboardsFilter.js'
import { sGetDashboardsFilter } from '../../../reducers/dashboardsFilter.js'
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
            pageSize: 40,
            page,
        }
    },
}

export const NavigationMenu = ({ close }) => {
    const dataEngine = useDataEngine()
    const dispatch = useDispatch()
    const filterText = useSelector(sGetDashboardsFilter)
    const hasDashboards = useRef(null)

    const [state, setState] = useState({
        dashboards: [],
        nextPage: 1,
        searchTerm: filterText,
    })

    const [initialFetchComplete, setInitialFetchComplete] = useState(false)

    const fetchDashboards = useCallback(
        async ({ dashboards, page, searchTerm }) => {
            const data = await dataEngine.query(
                { dashboards: dashboardsQuery },
                {
                    variables: {
                        page,
                        searchTerm,
                    },
                }
            )

            const response = {
                dashboards: data.dashboards.dashboards,
                nextPage: data.dashboards.pager.nextPage
                    ? data.dashboards.pager.page + 1
                    : null,
            }

            setInitialFetchComplete(true)
            if (hasDashboards.current === null) {
                hasDashboards.current = !!response.dashboards.length
            }

            setState((prevState) => ({
                dashboards:
                    page > 1
                        ? [...dashboards, ...response.dashboards]
                        : response.dashboards,
                nextPage: response.nextPage,
                searchTerm: prevState.searchTerm,
            }))
        },
        [dataEngine]
    )

    const onFilterChange = useCallback(
        ({ value }) => {
            dispatch(acSetDashboardsFilter(value))
            fetchDashboards({
                dashboards: [],
                page: 1,
                searchTerm: value,
            })
        },
        [dispatch, fetchDashboards]
    )

    const onEndReached = useCallback(() => {
        setState((prevState) => {
            if (prevState.nextPage !== null) {
                fetchDashboards({
                    dashboards: prevState.dashboards,
                    page: prevState.nextPage,
                    searchTerm: prevState.searchTerm,
                })
            }
            return prevState
        })
    }, [fetchDashboards])

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

    if (hasDashboards.current === false) {
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
                    {initialFetchComplete && state.dashboards.length === 0 ? (
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
                            {state.dashboards.map(
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
        </div>
    )
}

NavigationMenu.propTypes = {
    close: PropTypes.func.isRequired,
}
