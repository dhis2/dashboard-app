import { useCachedDataQuery } from '@dhis2/analytics'
import { CacheableSection, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acClearSelected } from '../../actions/selected.js'
import DashboardsBar from '../../components/DashboardsBar/index.js'
import LoadingMask from '../../components/LoadingMask.js'
import NoContentMessage from '../../components/NoContentMessage.js'
import getCacheableSectionId from '../../modules/getCacheableSectionId.js'
import { getPreferredDashboardId } from '../../modules/localStorage.js'
import { sGetSelectedId } from '../../reducers/selected.js'
import ViewDashboard from './ViewDashboard.js'

const firstDashboardQuery = {
    dashboards: {
        resource: 'dashboards',
        params: {
            fields: 'id,favorite,displayName',
            order: 'favorite:desc,displayName:asc',
            paging: true,
            pageSize: 1,
        },
    },
}

const requestedDashboardQuery = {
    dashboard: {
        resource: 'dashboards',
        id: ({ id }) => id,
        params: {
            fields: ['id', 'displayName'],
        },
    },
}

const NO_DASHBOARDS_FOUND = 'NO_DASHBOARDS_FOUND'
const REQUESTED_DASHBOARD_NOT_FOUND = 'REQUESTED_DASHBOARD_NOT_FOUND'

const CacheableViewDashboard = ({ match }) => {
    const { currentUser } = useCachedDataQuery()
    const engine = useDataEngine()
    const dispatch = useDispatch()
    const [idToLoad, setIdToLoad] = useState(null)
    const [fetchError, setFetchError] = useState(null)
    const [hasDashboards, setHasDashboards] = useState(true)
    const selectedId = useSelector(sGetSelectedId)
    const preferredId = getPreferredDashboardId(currentUser.username) || null
    // match comes from react-router-dom
    const routeId = match?.params?.dashboardId || null

    useEffect(() => {
        if (routeId === null && preferredId === null && selectedId !== null) {
            dispatch(acClearSelected())
        }
    }, [routeId, preferredId, selectedId, dispatch])

    useEffect(() => {
        const fetchIdToLoad = async () => {
            try {
                // no dashboard id provided so fetch the first starred/alphabetical dashboard
                if (!routeId && !preferredId) {
                    const { dashboards } = await engine.query(
                        firstDashboardQuery
                    )
                    if (dashboards.dashboards.length === 0) {
                        setFetchError(NO_DASHBOARDS_FOUND)
                        setHasDashboards(false)
                        return
                    }

                    const firstDashboardId = dashboards?.dashboards[0]?.id
                    setIdToLoad(firstDashboardId)
                    return
                }

                // get the dashboard by id
                if (routeId) {
                    const { dashboard } = await engine.query(
                        requestedDashboardQuery,
                        {
                            variables: { id: routeId },
                        }
                    )
                    setIdToLoad(dashboard.id)
                    return
                }

                // get the preferred dashboard
                const { dashboard } = await engine.query(
                    requestedDashboardQuery,
                    {
                        variables: { id: preferredId },
                    }
                )
                setIdToLoad(dashboard.id)
                return
            } catch (error) {
                if (routeId) {
                    setIdToLoad(null)
                    setFetchError(REQUESTED_DASHBOARD_NOT_FOUND)
                }

                const { dashboards } = await engine.query(firstDashboardQuery)

                if (dashboards.dashboards.length === 0) {
                    setHasDashboards(false)

                    if (!routeId) {
                        setFetchError(NO_DASHBOARDS_FOUND)
                    }
                    setIdToLoad(null)
                    return
                }
                const firstDashboardId = dashboards.dashboards[0].id
                setHasDashboards(true)
                setIdToLoad(firstDashboardId)
            }
        }
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
            />
        </CacheableSection>
    )
}

CacheableViewDashboard.propTypes = {
    match: PropTypes.object,
}

export default CacheableViewDashboard
