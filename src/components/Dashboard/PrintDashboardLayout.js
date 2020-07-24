import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'

import { acSetEditDashboard } from '../../actions/editDashboard'
import { sGetSelectedId } from '../../reducers/selected'
import {
    sGetDashboardById,
    sGetDashboardItems,
    sDashboardsIsFetching,
} from '../../reducers/dashboards'
import PrintTitleBar from '../TitleBar/PrintTitleBar'
import ItemGrid from '../ItemGrid/ItemGrid'
import NoContentMessage from '../../widgets/NoContentMessage'

export const Content = ({ updateAccess }) => {
    return updateAccess ? (
        <>
            <PrintTitleBar />
            <ItemGrid />
        </>
    ) : (
        <NoContentMessage text={i18n.t('No access')} />
    )
}

Content.propTypes = {
    updateAccess: PropTypes.bool,
}
const PrintDashboardLayout = props => {
    const [initialized, setInitialized] = useState(false)

    useEffect(() => {
        if (props.dashboard) {
            setInitialized(true)
            props.setEditDashboard(props.dashboard, props.items)
        }
    }, [props.dashboard, props.items, initialized])

    const contentNotReady = !props.dashboardsLoaded || props.id === null

    return (
        <div className="dashboard-wrapper">
            {contentNotReady ? null : (
                <Content updateAccess={props.updateAccess} />
            )}
        </div>
    )
}

PrintDashboardLayout.propTypes = {
    dashboard: PropTypes.object,
    dashboardsLoaded: PropTypes.bool,
    id: PropTypes.string,
    items: PropTypes.array,
    setEditDashboard: PropTypes.func,
    updateAccess: PropTypes.bool,
}

const mapStateToProps = state => {
    const id = sGetSelectedId(state)
    const dashboard = id ? sGetDashboardById(state, id) : null

    const updateAccess =
        dashboard && dashboard.access ? dashboard.access.update : false

    return {
        dashboard,
        id,
        updateAccess,
        items: sGetDashboardItems(state),
        dashboardsLoaded: !sDashboardsIsFetching(state),
    }
}

export default connect(mapStateToProps, {
    setEditDashboard: acSetEditDashboard,
})(PrintDashboardLayout)
