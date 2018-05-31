import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { fromDashboards, fromSelected } from '../reducers';
import PageContainer from '../PageContainer/PageContainer';
import PageContainerSpacer from '../PageContainer/PageContainerSpacer';
import EditBar from '../ControlBarContainer/EditBar';
import {
    acSetEditNewDashboard,
    acSetEditDashboard,
} from '../actions/editDashboard';

class EditDashboard extends Component {
    loadEditDashboard = () => {
        if (this.props.mode === 'new') {
            this.props.setNewDashboard();
        } else {
            this.props.setEditDashboard(this.props.dashboard, this.props.items);
        }
    };

    componentDidMount() {
        this.loadEditDashboard();
    }

    componentDidUpdate() {
        this.loadEditDashboard();
    }

    render() {
        return (
            <Fragment>
                <EditBar />
                <PageContainerSpacer />
                <PageContainer />
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    const dashboard = fromDashboards.sGetById(
        state,
        fromSelected.sGetSelectedId(state)
    );

    const items = fromDashboards.sGetItems(state);

    return {
        dashboard,
        items,
    };
};

export default connect(mapStateToProps, {
    setNewDashboard: acSetEditNewDashboard,
    setEditDashboard: acSetEditDashboard,
})(EditDashboard);
