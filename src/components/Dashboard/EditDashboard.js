import React, { Component } from 'react'
import { connect } from 'react-redux'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'

import DashboardVerticalOffset from './DashboardVerticalOffset'
import TitleBar from '../TitleBar/TitleBar'
import ItemGrid from '../ItemGrid/ItemGrid'
import EditBar from '../ControlBar/EditBar'
import PrintLayoutDashboard from './PrintLayoutDashboard'
import NoContentMessage from '../../widgets/NoContentMessage'
import { acSetEditDashboard } from '../../actions/editDashboard'
import { sGetSelectedId } from '../../reducers/selected'
import {
    sGetDashboardById,
    sGetDashboardItems,
} from '../../reducers/dashboards'
import { sGetIsPrintPreviewView } from '../../reducers/editDashboard'

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

    renderGrid = () => {
        if (!this.props.isPrintPreviewView) {
            return (
                <>
                    <TitleBar edit={true} />
                    <ItemGrid edit={true} />
                </>
            )
        } else {
            return <PrintLayoutDashboard fromEdit={true} />
        }
    }

    render() {
        return (
            <>
                <EditBar />
                <DashboardVerticalOffset editMode={true} />
                {this.props.updateAccess ? (
                    this.renderGrid()
                ) : (
                    <NoContentMessage text={i18n.t('No access')} />
                )}
                <div className="dashboard-wrapper">{}</div>
            </>
        )
    }
}

EditDashboard.propTypes = {
    dashboard: PropTypes.object,
    isPrintPreviewView: PropTypes.bool,
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
        updateAccess,
        items: sGetDashboardItems(state),
        isPrintPreviewView: sGetIsPrintPreviewView(state),
    }
}

export default connect(mapStateToProps, {
    setEditDashboard: acSetEditDashboard,
})(EditDashboard)
