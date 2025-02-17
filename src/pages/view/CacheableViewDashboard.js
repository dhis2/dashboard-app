import { useCachedDataQuery } from '@dhis2/analytics'
import { CacheableSection } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import isEmpty from 'lodash/isEmpty.js'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { acClearSelected } from '../../actions/selected.js'
import DashboardsBar from '../../components/DashboardsBar/index.js'
import LoadingMask from '../../components/LoadingMask.js'
import NoContentMessage from '../../components/NoContentMessage.js'
import getCacheableSectionId from '../../modules/getCacheableSectionId.js'
import { getPreferredDashboardId } from '../../modules/localStorage.js'
import {
    sDashboardsIsFetching,
    sGetDashboardById,
    sGetDashboardsSortedByStarred,
} from '../../reducers/dashboards.js'
import { sGetSelectedId } from '../../reducers/selected.js'
import ViewDashboard from './ViewDashboard.js'

const CacheableViewDashboard = ({
    clearSelectedDashboard,
    dashboardsIsEmpty,
    dashboardsLoaded,
    id,
    selectedId,
}) => {
    const { currentUser } = useCachedDataQuery()

    useEffect(() => {
        if (id === null && selectedId !== null) {
            clearSelectedDashboard()
        }
    }, [id, selectedId, clearSelectedDashboard])

    if (!dashboardsLoaded) {
        return <LoadingMask />
    }

    if (dashboardsIsEmpty || id === null) {
        return (
            <>
                <DashboardsBar />
                <NoContentMessage
                    text={
                        dashboardsIsEmpty
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
    dashboardsIsEmpty: PropTypes.bool,
    dashboardsLoaded: PropTypes.bool,
    id: PropTypes.string,
    selectedId: PropTypes.string,
}

const mapStateToProps = (state, ownProps) => {
    const dashboards = sGetDashboardsSortedByStarred(state)
    // match is provided by the react-router-dom
    const routeId = ownProps.match?.params?.dashboardId || null

    let dashboardToSelect = null
    if (routeId) {
        dashboardToSelect = sGetDashboardById(state, routeId) || null
    } else {
        const lastStoredDashboardId = getPreferredDashboardId(ownProps.username)
        const dash = sGetDashboardById(state, lastStoredDashboardId)
        dashboardToSelect = lastStoredDashboardId && dash ? dash : dashboards[0]
    }

    return {
        dashboardsIsEmpty: isEmpty(dashboards),
        dashboardsLoaded: !sDashboardsIsFetching(state),
        id: dashboardToSelect?.id || null,
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
