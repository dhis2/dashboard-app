import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import i18n from 'd2-i18n';
import ControlBar from '@dhis2/d2-ui-core/control-bar/ControlBar';
import TranslationDialog from '@dhis2/d2-ui-translation-dialog';

import PrimaryButton from '../../widgets/PrimaryButton';
import FlatButton from '../../widgets/FlatButton';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import {
    tSaveDashboard,
    acClearEditDashboard,
} from '../../actions/editDashboard';
import {
    tDeleteDashboard,
    acSetDashboardDisplayName,
} from '../../actions/dashboards';
import {
    sGetEditDashboardRoot,
    sGetIsNewDashboard,
} from '../../reducers/editDashboard';
import {
    CONTROL_BAR_ROW_HEIGHT,
    MIN_ROW_COUNT,
    getControlBarHeight,
} from './controlBarDimensions';
import { apiFetchDashboard } from '../../api/dashboards';

import './ControlBar.css';

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
        redirectUrl: undefined,
    };

    onConfirmDelete = () => {
        this.setState({ confirmDeleteDialogOpen: true });
    };

    onSave = () => {
        this.props.onSave().then(newId => {
            this.setState({ redirectUrl: `/${newId}` });
        });
    };

    onDiscard = () => {
        this.props.onDiscardChanges();
        const redirectUrl = this.props.dashboardId
            ? `/${this.props.dashboardId}`
            : '/';
        this.setState({ redirectUrl });
    };

    onContinueEditing = () => {
        this.setState({ confirmDeleteDialogOpen: false });
    };

    onDeleteConfirmed = () => {
        this.setState({ confirmDeleteDialogOpen: false });
        this.props.onDelete(this.props.dashboardId).then(() => {
            this.setState({ redirectUrl: '/' });
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

    fetchDashboardModel = () => {
        if (this.props.dashboardId && !this.state.dashboardModel) {
            apiFetchDashboard(this.props.dashboardId).then(dashboardModel =>
                this.setState({ dashboardModel })
            );
        }
    };

    componentDidMount() {
        this.fetchDashboardModel();
    }

    componentDidUpdate() {
        this.fetchDashboardModel();
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
                d2={this.context.d2}
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
        if (this.state.redirectUrl) {
            return <Redirect to={this.state.redirectUrl} />;
        }

        const { dashboardId, deleteAccess, updateAccess } = this.props;
        const controlBarHeight = getControlBarHeight(MIN_ROW_COUNT, false);

        const discardBtnText = updateAccess
            ? i18n.t('Exit without saving')
            : i18n.t('Go to dashboards');

        return (
            <Fragment>
                <ControlBar
                    height={controlBarHeight}
                    editMode={true}
                    expandable={false}
                >
                    <div style={buttonBarStyle}>
                        {updateAccess ? (
                            <div className="left-controls">
                                <span style={{ marginRight: '15px' }}>
                                    <PrimaryButton
                                        className="save-button"
                                        onClick={this.onSave}
                                    >
                                        {i18n.t('Save changes')}
                                    </PrimaryButton>
                                </span>
                                {dashboardId && deleteAccess ? (
                                    <FlatButton
                                        className="delete-button"
                                        onClick={this.onConfirmDelete}
                                    >
                                        {i18n.t('Delete')}
                                    </FlatButton>
                                ) : null}
                                {dashboardId ? (
                                    <FlatButton
                                        className="translate-button"
                                        onClick={this.toggleTranslationDialog}
                                    >
                                        {i18n.t('Translate')}
                                    </FlatButton>
                                ) : null}
                            </div>
                        ) : null}

                        <div className="right-controls">
                            <FlatButton
                                className="discard-button"
                                onClick={this.onDiscard}
                            >
                                {discardBtnText}
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
    const dashboard = sGetEditDashboardRoot(state);

    let deleteAccess;
    let updateAccess;
    if (sGetIsNewDashboard(state)) {
        deleteAccess = true;
        updateAccess = true;
    } else {
        updateAccess = dashboard.access ? dashboard.access.update : false;
        deleteAccess = dashboard.access ? dashboard.access.delete : false;
    }

    return {
        dashboardId: dashboard.id,
        dashboardName: dashboard.name,
        deleteAccess,
        updateAccess,
    };
};

const mapDispatchToProps = dispatch => ({
    onSave: () => dispatch(tSaveDashboard()).then(id => id),
    onDelete: id => dispatch(tDeleteDashboard(id)),
    onDiscardChanges: () => dispatch(acClearEditDashboard()),
    onTranslate: (id, value) => dispatch(acSetDashboardDisplayName(id, value)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditBar);
