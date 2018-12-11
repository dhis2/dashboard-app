import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import DashboardVerticalOffset from './DashboardVerticalOffset';
import EditBar from '../ControlBarContainer/EditBar';
import DashboardContent from './DashboardContent';
import { acSetEditNewDashboard } from '../actions/editDashboard';

class NewDashboard extends Component {
    componentDidMount() {
        this.props.setNewDashboard();
    }

    render() {
        return (
            <Fragment>
                <EditBar />
                <DashboardVerticalOffset />
                <div className="dashboard-wrapper">
                    <DashboardContent editMode={true} />
                </div>
            </Fragment>
        );
    }
}

export default connect(
    null,
    {
        setNewDashboard: acSetEditNewDashboard,
    }
)(NewDashboard);
