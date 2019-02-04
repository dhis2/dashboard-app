import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { acSetEditNewDashboard } from '../../actions/editDashboard';
import DashboardVerticalOffset from './DashboardVerticalOffset';
import EditBar from '../ControlBar/EditBar';
import DashboardContent from './DashboardContent';

class NewDashboard extends Component {
    componentDidMount() {
        this.props.setNewDashboard();
    }

    render() {
        return (
            <Fragment>
                <EditBar />
                <DashboardVerticalOffset editMode={true} />
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
