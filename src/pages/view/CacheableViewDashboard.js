import { useCachedDataQuery } from '@dhis2/analytics'
import {
    CacheableSection,
    useDataEngine,
    useCachedSections,
} from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetOfflineDashboards } from '../../actions/offlineDashboards.js'
import { acClearSelected } from '../../actions/selected.js'
import { viewDashboardQuery } from '../../api/fetchDashboard.js'
import {
    firstDashboardQuery,
    dashboardsByIdsQuery,
} from '../../api/fetchDashboards.js'
import DashboardsBar from '../../components/DashboardsBar/index.js'
import LoadingMask from '../../components/LoadingMask.js'
import NoContentMessage from '../../components/NoContentMessage.js'
import {
    getCacheableSectionId,
    getOfflineDashboardIds,
} from '../../modules/getCacheableSectionId.js'
import { getPreferredDashboardId } from '../../modules/localStorage.js'
import { sGetSelectedId } from '../../reducers/selected.js'
import ViewDashboard from './ViewDashboard.js'

const NO_DASHBOARDS_FOUND = 'NO_DASHBOARDS_FOUND'
const REQUESTED_DASHBOARD_NOT_FOUND = 'REQUESTED_DASHBOARD_NOT_FOUND'

const requestedDashboardQuery = {
    dashboard: viewDashboardQuery,
}

const CacheableViewDashboard = ({ match }) => {
    const { currentUser } = useCachedDataQuery()
    const { cachedSections } = useCachedSections()
    const engine = useDataEngine()
    const dispatch = useDispatch()
    const [idToLoad, setIdToLoad] = useState(null)
    const [dashboardName, setDashboardName] = useState(null)
    const [fetchError, setFetchError] = useState(null)
    const [hasDashboards, setHasDashboards] = useState(null)
    const currentId = useSelector(sGetSelectedId)
    const preferredId = getPreferredDashboardId(currentUser.username) || null
    // match comes from react-router-dom
    const routeId = match?.params?.dashboardId || null

    const offlineDashboardIds = useMemo(
        () => getOfflineDashboardIds(currentUser.id, cachedSections),
        [currentUser.id, cachedSections]
    )

    useEffect(() => {
        console.log('jj CVD request offline dashboards', offlineDashboardIds)
        engine.query(dashboardsByIdsQuery, {
            variables: { ids: offlineDashboardIds },
            onComplete: (data) => {
                dispatch(acSetOfflineDashboards(data.dashboards.dashboards))
            },
        })
    }, [engine, dispatch, offlineDashboardIds])

    useEffect(() => {
        if (routeId === null && preferredId === null && currentId !== null) {
            dispatch(acClearSelected())
        }
    }, [routeId, preferredId, currentId, dispatch])

    useEffect(() => {
        const fetchIdToLoad = async () => {
            try {
                // no id, so fetch the first starred/alphabetical dashboard in the catch block
                if (!routeId && !preferredId) {
                    throw new Error('No dashboard id provided')
                }

                // get the dashboard by id, throws an error if the dashboard is not found
                const { dashboard } = await engine.query(
                    requestedDashboardQuery,
                    {
                        variables: { id: routeId || preferredId },
                    }
                )
                setDashboardName(dashboard.displayName)
                setIdToLoad(dashboard.id)
                setHasDashboards(true)
            } catch (error) {
                const { dashboards } = await engine.query(firstDashboardQuery)

                // this is required for offline dashboards
                // if (!routeId && !preferredId && dashboards.dashboards[0]) {
                //     engine.query(requestedDashboardQuery, {
                //         variables: { id: dashboards.dashboards[0].id },
                //     })
                // }

                setHasDashboards(dashboards.dashboards.length > 0)

                if (!routeId) {
                    setDashboardName(
                        dashboards.dashboards[0]?.displayName || null
                    )
                    setIdToLoad(dashboards.dashboards[0]?.id || null)
                    setFetchError(
                        !dashboards.dashboards.length && NO_DASHBOARDS_FOUND
                    )
                } else {
                    setFetchError(REQUESTED_DASHBOARD_NOT_FOUND)
                }
            }
        }

        setIdToLoad(null)
        setDashboardName(null)
        setFetchError(null)

        fetchIdToLoad()
    }, [engine, routeId, preferredId])

    if (fetchError) {
        return (
            <>
                <DashboardsBar hasDashboards={hasDashboards} />
                <NoContentMessage
                    text={
                        fetchError === REQUESTED_DASHBOARD_NOT_FOUND
                            ? i18n.t('Requested dashboard not found')
                            : i18n.t(
                                  'No dashboards found. Use the + button to create a new dashboard.'
                              )
                    }
                />
            </>
        )
    }

    if (idToLoad === null) {
        return <LoadingMask />
    }

    const cacheSectionId = getCacheableSectionId(currentUser.id, idToLoad)

    return (
        <CacheableSection id={cacheSectionId} loadingMask={<LoadingMask />}>
            <ViewDashboard
                key={cacheSectionId}
                requestedId={idToLoad}
                username={currentUser.username}
                hasDashboards={hasDashboards}
                requestedDashboardName={dashboardName}
            />
        </CacheableSection>
    )
}

CacheableViewDashboard.propTypes = {
    match: PropTypes.object,
}

export default CacheableViewDashboard
