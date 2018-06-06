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
    state = {
        initialized: false,
    };

    initEditDashboard = () => {
        if (this.props.mode === 'new') {
            this.setState({ initialized: true });
            this.props.setNewDashboard();
        } else {
            if (this.props.dashboard) {
                this.setState({ initialized: true });
                this.props.setEditDashboard(
                    this.props.dashboard,
                    this.props.items
                );
            }
        }
    };

    componentDidMount() {
        this.initEditDashboard();
    }

    componentDidUpdate() {
        if (!this.state.initialized) {
            this.initEditDashboard();
        }
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
    const selectedId = fromSelected.sGetSelectedId(state);
    const dashboard = selectedId
        ? fromDashboards.sGetById(state, selectedId)
        : null;

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
