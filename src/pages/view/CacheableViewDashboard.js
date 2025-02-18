import { useCachedDataQuery } from '@dhis2/analytics'
import { CacheableSection, useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { acClearSelected } from '../../actions/selected.js'
import DashboardsBar from '../../components/DashboardsBar/index.js'
import LoadingMask from '../../components/LoadingMask.js'
import NoContentMessage from '../../components/NoContentMessage.js'
import getCacheableSectionId from '../../modules/getCacheableSectionId.js'
import { getPreferredDashboardId } from '../../modules/localStorage.js'
import { sGetSelectedId } from '../../reducers/selected.js'
import ViewDashboard from './ViewDashboard.js'

const query = {
    dashboards: {
        resource: 'dashboards',
        params: {
            fields: 'id',
            paging: true,
            pageSize: 1,
        },
    },
}

const CacheableViewDashboard = ({ clearSelectedDashboard, id, selectedId }) => {
    const { currentUser } = useCachedDataQuery()
    const { data, loading, fetching } = useDataQuery(query)

    useEffect(() => {
        if (id === null && selectedId !== null) {
            clearSelectedDashboard()
        }
    }, [id, selectedId, clearSelectedDashboard])

    if (loading || fetching) {
        return <LoadingMask />
    }

    if (!data?.dashboards.dashboards.length || id === null) {
        return (
            <>
                <DashboardsBar />
                <NoContentMessage
                    text={
                        !data?.dashboards.dashboards.length
                            ? i18n.t(
                                  'No dashboards found. Use the + button to create a new dashboard.'
                              )
                            : i18n.t('Requested dashboard not found')
                    }
                />
            </>
        )
    }

    const cacheSectionId = getCacheableSectionId(currentUser.id, id)

    return (
        <CacheableSection id={cacheSectionId} loadingMask={<LoadingMask />}>
            <ViewDashboard
                key={cacheSectionId}
                requestedId={id}
                username={currentUser.username}
            />
        </CacheableSection>
    )
}

CacheableViewDashboard.propTypes = {
    clearSelectedDashboard: PropTypes.func,
    id: PropTypes.string,
    selectedId: PropTypes.string,
}

const mapStateToProps = (state, ownProps) => {
    // match is provided by the react-router-dom
    const routeId = ownProps.match?.params?.dashboardId || null

    const dashboardIdToSelect =
        routeId || getPreferredDashboardId(ownProps.username)

    return {
        id: dashboardIdToSelect || null,
        selectedId: sGetSelectedId(state) || null,
    }
}

const mapDispatchToProps = {
    clearSelectedDashboard: acClearSelected,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CacheableViewDashboard)
