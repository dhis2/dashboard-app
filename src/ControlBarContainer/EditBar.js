import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import ControlBar from 'd2-ui/lib/controlbar/ControlBar';
import PrimaryButton from '../widgets/PrimaryButton';
import FlatButton from '../widgets/FlatButton';
import TranslationDialog from 'd2-ui/lib/i18n/TranslationDialog.component';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { tSaveDashboard, acClearEditDashboard } from '../actions/editDashboard';
import { tDeleteDashboard } from '../actions/dashboards';
import { sGetEditDashboard } from '../reducers/editDashboard';
import { CONTROL_BAR_ROW_HEIGHT, getOuterHeight } from './ControlBarContainer';
import { apiFetchSelected } from '../api/dashboards';

const styles = {
    buttonBar: {
        height: CONTROL_BAR_ROW_HEIGHT,
        paddingTop: '15px',
        marginLeft: '15px',
        marginRight: '15px',
    },
};

class EditBar extends Component {
    state = {
        translationDialogIsOpen: false,
        dashboardModel: undefined,
        confirmDeleteDialogOpen: false,
    };

    onConfirmDelete = () => {
        this.setState({ confirmDeleteDialogOpen: true });
    };

    onContinueEditing = () => {
        this.setState({ confirmDeleteDialogOpen: false });
    };

    onDeleteConfirmed = () => {
        this.setState({ confirmDeleteDialogOpen: false });
        this.props.onDelete(this.props.dashboardId);
    };

    componentDidMount() {
        apiFetchSelected(this.props.dashboardId).then(dashboardModel =>
            this.setState({ dashboardModel })
        );
    }

    toggleTranslationDialog = () => {
        this.setState({
            translationDialogIsOpen: !this.state.translationDialogIsOpen,
        });
    };

    confirmDeleteDialog = () =>
        this.props.deleteAccess && this.props.dashboardId ? (
            <ConfirmDeleteDialog
                dashboardName={this.props.dashboardName}
                onDeleteConfirmed={this.onDeleteConfirmed}
                onContinueEditing={this.onContinueEditing}
                open={this.state.confirmDeleteDialogOpen}
            />
        ) : null;

    translationDialog = () =>
        this.state.dashboardModel && this.state.dashboardModel.id ? (
            <TranslationDialog
                open={this.state.translationDialogIsOpen}
                onRequestClose={this.toggleTranslationDialog}
                objectToTranslate={this.state.dashboardModel}
                fieldsToTranslate={['name', 'description']}
                // TODO handle messages in snackbar
                onTranslationSaved={msg =>
                    console.log('translation update response', msg)
                }
                onTranslationError={err =>
                    console.log('translation update error', err)
                }
            />
        ) : null;

    render() {
        const {
            style,
            onSave,
            onDiscard,
            dashboardId,
            deleteAccess,
        } = this.props;
        const controlBarHeight = getOuterHeight(1, false);

        return (
            <Fragment>
                <ControlBar
                    height={controlBarHeight}
                    editMode={true}
                    expandable={false}
                >
                    <div style={styles.buttonBar}>
                        <div style={style.leftControls}>
                            <span style={{ marginRight: '15px' }}>
                                <PrimaryButton onClick={onSave}>
                                    Save Changes
                                </PrimaryButton>
                            </span>
                            {dashboardId && deleteAccess ? (
                                <FlatButton onClick={this.onConfirmDelete}>
                                    Delete
                                </FlatButton>
                            ) : null}
                            {dashboardId ? (
                                <FlatButton
                                    onClick={this.toggleTranslationDialog}
                                >
                                    Translate
                                </FlatButton>
                            ) : null}
                        </div>
                        <div style={style.rightControls}>
                            <FlatButton onClick={onDiscard}>
                                Exit without saving
                            </FlatButton>
                        </div>
                    </div>
                </ControlBar>
                {this.translationDialog()}
                {this.confirmDeleteDialog()}
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    const dashboard = sGetEditDashboard(state);

    return {
        dashboardId: dashboard.id,
        dashboardName: dashboard.name,
        deleteAccess: dashboard.access ? dashboard.access.delete : false,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSave: () => {
            dispatch(tSaveDashboard());
        },
        onDiscard: () => {
            dispatch(acClearEditDashboard());
        },
        onDelete: id => {
            dispatch(tDeleteDashboard(id));
        },
    };
};

const EditBarCt = connect(mapStateToProps, mapDispatchToProps)(EditBar);

export default EditBarCt;
