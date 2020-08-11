import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { acSetEditNewDashboard } from '../../actions/editDashboard'
import DashboardVerticalOffset from './DashboardVerticalOffset'
import EditBar from '../ControlBar/EditBar'
import TitleBar from '../TitleBar/TitleBar'
import ItemGrid from '../ItemGrid/ItemGrid'

class NewDashboard extends Component {
    componentDidMount() {
        this.props.setNewDashboard()
    }

    render() {
        return (
            <>
                <EditBar />
                <DashboardVerticalOffset editMode={true} />
                <div className="dashboard-wrapper">
                    <TitleBar edit={true} />
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
