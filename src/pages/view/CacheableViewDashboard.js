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

const CacheableViewDashboard = ({ match }) => {
    const { currentUser } = useCachedDataQuery()
    const engine = useDataEngine()
    const dispatch = useDispatch()
    const [idToLoad, setIdToLoad] = useState(undefined)
    let preferredId = getPreferredDashboardId(currentUser.username)
    const selectedId = useSelector(sGetSelectedId)
    // match comes from react-router-dom
    const routeId = match?.params?.dashboardId || null

    // TODO - is this really needed?
    if (preferredId === 'null') {
        preferredId = null
    }

    const id = routeId || preferredId

    useEffect(() => {
        if (id === null && selectedId !== null) {
            dispatch(acClearSelected())
        }
    }, [id, selectedId, dispatch])

    useEffect(() => {
        const fetchIdToLoad = async () => {
            try {
                const { dashboard } = await engine.query(
                    requestedDashboardQuery,
                    {
                        variables: { id },
                    }
                )
                setIdToLoad(dashboard.id)
            } catch (error) {
                const { dashboards } = await engine.query(firstDashboardQuery)

                if (dashboards.dashboards.length === 0) {
                    setIdToLoad(null)
                    return
                }
                const firstDashboardId = dashboards?.dashboards[0]?.id
                setIdToLoad(firstDashboardId)
            }
        }

        fetchIdToLoad()
    }, [engine, id])

    if (idToLoad === undefined) {
        return <LoadingMask />
    }

    if (idToLoad === null) {
        return (
            <>
                <DashboardsBar />
                <NoContentMessage
                    text={i18n.t(
                        'No dashboards found. Use the + button to create a new dashboard.'
                    )}
                />
            </>
        )
    }

    const cacheSectionId = getCacheableSectionId(currentUser.id, idToLoad)

    return (
        <CacheableSection id={cacheSectionId} loadingMask={<LoadingMask />}>
            <ViewDashboard
                key={cacheSectionId}
                requestedId={idToLoad}
                username={currentUser.username}
            />
        </CacheableSection>
    )
}

CacheableViewDashboard.propTypes = {
    match: PropTypes.object,
}

export default CacheableViewDashboard
