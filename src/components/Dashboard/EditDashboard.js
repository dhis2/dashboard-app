import React, { Component } from 'react'
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
import DashboardVerticalOffset from './DashboardVerticalOffset'
import TitleBar from '../TitleBar/TitleBar'
import ItemGrid from '../ItemGrid/ItemGrid'
import EditBar from '../ControlBar/EditBar'
import NoContentMessage from '../../widgets/NoContentMessage'

export const Content = ({ updateAccess }) => {
    return updateAccess ? (
        <>
            <TitleBar edit={true} />
            <ItemGrid edit={true} />
        </>
    ) : (
        <NoContentMessage text={i18n.t('No access')} />
    )
}

Content.propTypes = {
    updateAccess: PropTypes.bool,
}
export class EditDashboard extends Component {
    state = {
        initialized: false,
    }

    initEditDashboard = () => {
        if (this.props.dashboard) {
            this.setState({ initialized: true })
            this.props.setEditDashboard(this.props.dashboard, this.props.items)
        }
    }

    componentDidMount() {
        this.initEditDashboard()
    }

    componentDidUpdate() {
        if (!this.state.initialized) {
            this.initEditDashboard()
        }
    }

    getDashboardContent = () => {
        const contentNotReady =
            !this.props.dashboardsLoaded || this.props.id === null

        return (
            <div className="dashboard-wrapper">
                {contentNotReady ? null : (
                    <Content updateAccess={this.props.updateAccess} />
                )}
            </div>
        )
    }

    render() {
        return (
            <>
                <EditBar />
                <DashboardVerticalOffset editMode={true} />
                {this.getDashboardContent()}
            </>
        )
    }
}

EditDashboard.propTypes = {
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
})(EditDashboard)
