import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Input, Menu } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import useDebounce from '../../../modules/useDebounce.js'
import { EndIntersectionDetector } from './EndIntersectionDetector.js'
import { NavigationMenuItem } from './NavigationMenuItem.js'
import styles from './styles/NavigationMenu.module.css'
import itemStyles from './styles/NavigationMenuItem.module.css'

const dashboardsQuery = {
    resource: 'dashboards',
    params: ({ page, filterText }) => {
        return {
            fields: 'id,displayName,favorite~rename(starred)',
            order: 'favorite:desc,displayName:asc',
            filter: filterText ? `displayName:ilike:${filterText}` : undefined,
            paging: true,
            pageSize: 8,
            page,
        }
    },
}

export const NavigationMenu = ({ close, hasDashboards }) => {
    const dataEngine = useDataEngine()
    const [initialFetchComplete, setInitialFetchComplete] = useState(null)
    const [dashboards, setDashboards] = useState([])
    const [requestParams, setRequestParams] = useState({
        page: 1,
        filterText: '',
    })
    const debouncedRequestParams = useDebounce(requestParams, 300)

    useEffect(() => {
        const fetchDashboards = async () => {
            const { page, filterText } = debouncedRequestParams
            const data = await dataEngine.query(
                { dashboards: dashboardsQuery },
                {
                    variables: {
                        page,
                        filterText,
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

            setDashboards((currentDashboards) =>
                page > 1
                    ? [...currentDashboards, ...response.dashboards]
                    : response.dashboards
            )

            if (response.nextPage === null) {
                setRequestParams({ page: null, filterText })
            }
        }

        if (debouncedRequestParams.page !== null) {
            fetchDashboards()
        }
    }, [dataEngine, debouncedRequestParams])

    const onFilterChange = useCallback(({ value }) => {
        setRequestParams({ page: 1, filterText: value })

        // prevent onEndReached from firing when the user changing filter text
        scrollBoxRef.current?.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
            instant: false,
        })
    }, [])

    const onEndReached = useCallback(() => {
        setRequestParams((currParams) => ({
            ...currParams,
            page:
                currParams.page !== null
                    ? currParams.page + 1
                    : currParams.page,
        }))
    }, [])

    const scrollBoxRef = useRef(null)

    // scroll initially to the selected item
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

    if (!hasDashboards) {
        return (
            <div
                className={cx(styles.container, styles.noDashboardsAvailable)}
                data-test="navmenu-no-dashboards-message"
            >
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
                    value={requestParams.filterText}
                    onChange={onFilterChange}
                    initialFocus={true}
                />
            </div>
            {initialFetchComplete !== null && (
                <div ref={scrollBoxRef} className={styles.scrollbox}>
                    <Menu dense>
                        {dashboards.length === 0 ? (
                            <li
                                className={styles.noItems}
                                data-test="navmenu-no-items-found"
                            >
                                {i18n.t(
                                    'No dashboards found for "{{- filterText}}"',
                                    {
                                        filterText: requestParams.filterText,
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
    hasDashboards: PropTypes.bool.isRequired,
}
