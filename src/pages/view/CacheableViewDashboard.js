import { useCachedDataQuery } from '@dhis2/analytics'
import { CacheableSection, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acClearSelected } from '../../actions/selected.js'
import {
    firstDashboardQuery,
    requestedDashboardQuery,
} from '../../api/fetchDashboards.js'
import DashboardsBar from '../../components/DashboardsBar/index.js'
import LoadingMask from '../../components/LoadingMask.js'
import NoContentMessage from '../../components/NoContentMessage.js'
import getCacheableSectionId from '../../modules/getCacheableSectionId.js'
import { getPreferredDashboardId } from '../../modules/localStorage.js'
import { sGetSelectedId } from '../../reducers/selected.js'
import ViewDashboard from './ViewDashboard.js'

const NO_DASHBOARDS_FOUND = 'NO_DASHBOARDS_FOUND'
const REQUESTED_DASHBOARD_NOT_FOUND = 'REQUESTED_DASHBOARD_NOT_FOUND'

const CacheableViewDashboard = ({ match }) => {
    const { currentUser } = useCachedDataQuery()
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

    useEffect(() => {
        if (routeId === null && preferredId === null && currentId !== null) {
            dispatch(acClearSelected())
        }
    }, [routeId, preferredId, currentId, dispatch])

    useEffect(() => {
        const fetchIdToLoad = async () => {
            try {
                // no dashboard id provided so fetch the first
                // starred/alphabetical dashboard in the catch block
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
            } catch (error) {
                if (routeId) {
                    // show error msg since routeId was requested but wasn't found
                    setIdToLoad(null)
                    setDashboardName(null)
                    setFetchError(REQUESTED_DASHBOARD_NOT_FOUND)
                }
                // still need to know if there are any dashboards for the navigation menu
                const { dashboards } = await engine.query(firstDashboardQuery)

                setHasDashboards(dashboards.dashboards.length > 0)

                if (!routeId) {
                    setDashboardName(
                        dashboards.dashboards[0]?.displayName || null
                    )
                    setIdToLoad(dashboards.dashboards[0]?.id || null)
                    setFetchError(
                        !dashboards.dashboards.length && NO_DASHBOARDS_FOUND
                    )
                }
            }
        }

        setIdToLoad(null)
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
