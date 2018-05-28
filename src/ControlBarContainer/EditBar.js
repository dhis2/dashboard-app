import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import i18n from 'd2-i18n';
import ControlBar from 'd2-ui/lib/controlbar/ControlBar';
import PrimaryButton from '../widgets/PrimaryButton';
import FlatButton from '../widgets/FlatButton';
import TranslationDialog from 'd2-ui/lib/i18n/TranslationDialog.component';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { tSaveDashboard, acClearEditDashboard } from '../actions/editDashboard';
import {
    tDeleteDashboard,
    acSetDashboardDisplayName,
} from '../actions/dashboards';
import { sGetEditDashboard } from '../reducers/editDashboard';
import { CONTROL_BAR_ROW_HEIGHT, getOuterHeight } from './controlBarDimensions';
import { MIN_ROW_COUNT } from './DashboardsBar';
import { apiFetchDashboard } from '../api/dashboards';

import './ControlBarContainer.css';

const buttonBarStyle = {
    height: CONTROL_BAR_ROW_HEIGHT,
    paddingTop: '15px',
    marginLeft: '15px',
    marginRight: '15px',
};

export class EditBar extends Component {
    state = {
        translationDialogIsOpen: false,
        dashboardModel: undefined,
        confirmDeleteDialogOpen: false,
    };

    onConfirmDelete = () => {
        this.setState({ confirmDeleteDialogOpen: true });
    };

    onSave = () => {
        this.props.save().then(newId => {
            this.props.clearEditDashboard();
            this.props.history.push(`/view/${newId}`);
        });
    };

    onContinueEditing = () => {
        this.setState({ confirmDeleteDialogOpen: false });
    };

    onDeleteConfirmed = () => {
        this.setState({ confirmDeleteDialogOpen: false });
        this.props.onDelete(this.props.dashboardId).then(() => {
            this.props.history.push('/');
        });
    };

    onTranslationsSaved = async translations => {
        if (translations && translations.length) {
            const dbLocale = await this.context.d2.currentUser.userSettings.get(
                'keyDbLocale'
            );

            const translation = translations.find(
                t => t.locale === dbLocale && t.property === 'NAME'
            );

            if (translation && translation.value) {
                this.props.onTranslate(
                    this.props.dashboardId,
                    translation.value
                );
            }
        }
    };

    componentDidMount() {
        apiFetchDashboard(this.props.dashboardId).then(dashboardModel =>
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
                onTranslationSaved={this.onTranslationsSaved}
                onTranslationError={err =>
                    console.log('translation update error', err)
                }
            />
        ) : null;

    render() {
        const { clearEditDashboard, dashboardId, deleteAccess } = this.props;
        const controlBarHeight = getOuterHeight(MIN_ROW_COUNT, false);

        return (
            <Fragment>
                <ControlBar
                    height={controlBarHeight}
                    editMode={true}
                    expandable={false}
                >
                    <div style={buttonBarStyle}>
                        <div className="left-controls">
                            <span style={{ marginRight: '15px' }}>
                                <PrimaryButton onClick={this.onSave}>
                                    {i18n.t('Save changes')}
                                </PrimaryButton>
                            </span>
                            {dashboardId && deleteAccess ? (
                                <FlatButton onClick={this.onConfirmDelete}>
                                    {i18n.t('Delete')}
                                </FlatButton>
                            ) : null}
                            {dashboardId ? (
                                <FlatButton
                                    onClick={this.toggleTranslationDialog}
                                >
                                    {i18n.t('Translate')}
                                </FlatButton>
                            ) : null}
                        </div>
                        <div className="right-controls">
                            <FlatButton onClick={clearEditDashboard}>
                                {i18n.t('Exit without saving')}
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

EditBar.contextTypes = {
    d2: PropTypes.object,
};

const mapStateToProps = state => {
    const dashboard = sGetEditDashboard(state);

    return {
        dashboardId: dashboard.id,
        dashboardName: dashboard.name,
        deleteAccess: dashboard.access ? dashboard.access.delete : false,
    };
};

function mapDispatchToProps(dispatch) {
    const save = () => dispatch(tSaveDashboard()).then(id => id);

    const clearEditDashboard = () => dispatch(acClearEditDashboard());

    return {
        save,
        clearEditDashboard,
        onDelete: id => dispatch(tDeleteDashboard(id)),
        onTranslate: acSetDashboardDisplayName,
    };
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(EditBar)
);
