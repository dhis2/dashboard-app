import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'

import {
    sGetAllDashboards,
    sDashboardsIsFetching,
} from '../../reducers/dashboards'
import { sGetIsEditing } from '../../reducers/editDashboard'
import { acClearEditDashboard } from '../../actions/editDashboard'
import { sGetSelectedId } from '../../reducers/selected'
import DashboardsBar from '../ControlBar/ViewControlBar'
import DashboardVerticalOffset from './DashboardVerticalOffset'
import ViewTitleBar from '../TitleBar/ViewTitleBar'
import ViewItemGrid from '../ItemGrid/ViewItemGrid'
import FilterBar from '../FilterBar/FilterBar'

import NoContentMessage from '../../widgets/NoContentMessage'

export const Content = ({ hasDashboardContent, dashboardsIsEmpty }) => {
    const msg = dashboardsIsEmpty
        ? i18n.t(
              'No dashboards found. Use the + button to create a new dashboard.'
          )
        : i18n.t('Requested dashboard not found')

    return hasDashboardContent ? (
        <>
            <ViewTitleBar />
            <FilterBar />
            <ViewItemGrid />
        </>
    ) : (
        <NoContentMessage text={msg} />
    )
}

Content.propTypes = {
    dashboardsIsEmpty: PropTypes.bool,
    hasDashboardContent: PropTypes.bool,
}

export const ViewDashboard = ({
    id,
    dashboardsIsEmpty,
    dashboardsLoaded,
    dashboardIsEditing,
    acClearEditDashboard,
}) => {
    const hasDashboardContent = id && !dashboardsIsEmpty
    const contentNotReady = !dashboardsLoaded || id === null

    useEffect(() => {
        if (dashboardIsEditing) {
            acClearEditDashboard()
        }
    }, [dashboardIsEditing])

    return (
        <>
            <DashboardsBar />
            <DashboardVerticalOffset />
            <div className="dashboard-wrapper">
                {contentNotReady ? null : (
                    <Content
                        hasDashboardContent={hasDashboardContent}
                        dashboardsIsEmpty={dashboardsIsEmpty}
                    />
                )}
            </div>
        </>
    )
}

ViewDashboard.propTypes = {
    acClearEditDashboard: PropTypes.func,
    dashboardIsEditing: PropTypes.bool,
    dashboardsIsEmpty: PropTypes.bool,
    dashboardsLoaded: PropTypes.bool,
    id: PropTypes.string,
}

const mapStateToProps = state => {
    const dashboards = sGetAllDashboards(state)

    return {
        id: sGetSelectedId(state),
        dashboardsIsEmpty: isEmpty(dashboards),
        dashboardsLoaded: !sDashboardsIsFetching(state),
        dashboardIsEditing: sGetIsEditing(state),
    }
}

export default connect(mapStateToProps, {
    acClearEditDashboard,
})(ViewDashboard)
