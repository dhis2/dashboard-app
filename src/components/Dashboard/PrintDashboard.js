import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import PrintTitleBar from '../TitleBar/PrintTitleBar'
import PrintInfo from './PrintInfo'
import PrintActionsBar from './PrintActionsBar'
import PrintItemGrid from '../ItemGrid/PrintItemGrid'
import { acSetEditDashboard } from '../../actions/editDashboard'
import { sGetSelectedId } from '../../reducers/selected'
import {
    sGetDashboardById,
    sGetDashboardItems,
} from '../../reducers/dashboards'

import classes from './PrintDashboard.module.css'

export class PrintDashboard extends Component {
    state = {
        initialized: false,
    }

    initPrintDashboard = () => {
        if (this.props.dashboard) {
            this.setState({ initialized: true })
            this.props.setEditDashboard(this.props.dashboard, this.props.items)
        }
    }

    componentDidMount() {
        this.initPrintDashboard()
    }

    componentDidUpdate() {
        if (!this.state.initialized) {
            this.initPrintDashboard()
        }
    }

    render() {
        return (
            <>
                <PrintActionsBar id={this.props.dashboard.id} />
                <div className={classes.wrapper}>
                    <PrintInfo />
                    <div className={classes.pageOuter}>
                        <PrintTitleBar />
                        <PrintItemGrid />
                    </div>
                </div>
            </>
        )
    }
}

PrintDashboard.propTypes = {
    dashboard: PropTypes.object,
    items: PropTypes.array,
    setEditDashboard: PropTypes.func,
}

const mapStateToProps = state => {
    const id = sGetSelectedId(state)
    const dashboard = id ? sGetDashboardById(state, id) : null

    return {
        dashboard,
        id,
        items: sGetDashboardItems(state),
    }
}

export default connect(mapStateToProps, {
    setEditDashboard: acSetEditDashboard,
})(PrintDashboard)
