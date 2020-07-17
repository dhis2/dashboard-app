import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { acSetEditNewDashboard } from '../../actions/editDashboard'
import DashboardVerticalOffset from './DashboardVerticalOffset'
import EditControlBar from '../ControlBar/EditControlBar'
import EditTitleBar from '../TitleBar/EditTitleBar'
import ItemGrid from '../ItemGrid/ItemGrid'

class NewDashboard extends Component {
    componentDidMount() {
        this.props.setNewDashboard()
    }

    render() {
        return (
            <>
                <EditControlBar />
                <DashboardVerticalOffset editMode={true} />
                <div className="dashboard-wrapper">
                    <EditTitleBar />
                    <ItemGrid edit={true} />
                </div>
            </>
        )
    }
}

NewDashboard.propTypes = {
    setNewDashboard: PropTypes.func,
}

export default connect(null, {
    setNewDashboard: acSetEditNewDashboard,
})(NewDashboard)
