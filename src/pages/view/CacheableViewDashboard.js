import { CacheableSection } from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import i18n from '@dhis2/d2-i18n'
import isEmpty from 'lodash/isEmpty.js'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import DashboardsBar from '../../components/DashboardsBar/DashboardsBar.js'
import LoadingMask from '../../components/LoadingMask.js'
import NoContentMessage from '../../components/NoContentMessage.js'
import getCacheableSectionId from '../../modules/getCacheableSectionId.js'
import { getPreferredDashboardId } from '../../modules/localStorage.js'
import {
    sDashboardsIsFetching,
    sGetDashboardById,
    sGetDashboardsSortedByStarred,
} from '../../reducers/dashboards.js'
import ViewDashboard from './ViewDashboard.js'

const CacheableViewDashboard = ({
    id,
    dashboardsLoaded,
    dashboardsIsEmpty,
}) => {
    const [dashboardsBarExpanded, setDashboardsBarExpanded] = useState(false)
    const { d2 } = useD2()

    if (!dashboardsLoaded) {
        return <LoadingMask />
    }

    if (dashboardsIsEmpty || id === null) {
        return (
            <>
                <DashboardsBar
                    expanded={dashboardsBarExpanded}
                    onExpandedChanged={(expanded) =>
                        setDashboardsBarExpanded(expanded)
                    }
                />
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

    const cacheSectionId = getCacheableSectionId(d2.currentUser.id, id)

    return (
        <CacheableSection id={cacheSectionId} loadingMask={<LoadingMask />}>
            <ViewDashboard
                key={cacheSectionId}
                requestedId={id}
                username={d2.currentUser.username}
            />
        </CacheableSection>
    )
}

CacheableViewDashboard.propTypes = {
    dashboardsIsEmpty: PropTypes.bool,
    dashboardsLoaded: PropTypes.bool,
    id: PropTypes.string,
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
    }
}

export default connect(mapStateToProps, null)(CacheableViewDashboard)
