import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import i18n from '@dhis2/d2-i18n'
import TranslationDialog from '@dhis2/d2-ui-translation-dialog'
import { Button, ButtonStrip } from '@dhis2/ui'

import ConfirmDeleteDialog from './ConfirmDeleteDialog'
import {
    tSaveDashboard,
    acClearEditDashboard,
    acSetPrintPreviewView,
    acClearPrintPreviewView,
} from '../../actions/editDashboard'
import { acClearPrintDashboard } from '../../actions/printDashboard'
import {
    tDeleteDashboard,
    acSetDashboardDisplayName,
} from '../../actions/dashboards'
import {
    sGetEditDashboardRoot,
    sGetIsNewDashboard,
    sGetIsPrintPreviewView,
} from '../../reducers/editDashboard'
import { apiFetchDashboard } from '../../api/dashboards'

import classes from './styles/EditBar.module.css'

export class EditBar extends Component {
    state = {
        translationDialogIsOpen: false,
        dashboardModel: undefined,
        dashboard: undefined,
        confirmDeleteDialogOpen: false,
        redirectUrl: undefined,
    }

    onConfirmDelete = () => {
        this.setState({ confirmDeleteDialogOpen: true })
    }

    onSave = () => {
        this.props.onSave().then(newId => {
            this.setState({ redirectUrl: `/${newId}` })
        })
    }

    onPrintPreview = () => {
        if (this.props.isPrintPreviewView) {
            this.props.clearPrintPreview()
            this.props.clearPrintDashboard()
        } else {
            this.props.showPrintPreview()
        }
    }

    onDiscard = () => {
        this.props.onDiscardChanges()
        const redirectUrl = this.props.dashboardId
            ? `/${this.props.dashboardId}`
            : '/'

        this.setState({ redirectUrl })
    }

    onContinueEditing = () => {
        this.setState({ confirmDeleteDialogOpen: false })
    }

    onDeleteConfirmed = () => {
        this.setState({ confirmDeleteDialogOpen: false })
        this.props.onDelete(this.props.dashboardId).then(() => {
            this.setState({ redirectUrl: '/' })
        })
    }

    onTranslationsSaved = async translations => {
        if (translations && translations.length) {
            const dbLocale = await this.context.d2.currentUser.userSettings.get(
                'keyDbLocale'
            )

            const translation = translations.find(
                t => t.locale === dbLocale && t.property === 'NAME'
            )

            if (translation && translation.value) {
                this.props.onTranslate(
                    this.props.dashboardId,
                    translation.value
                )
            }
        }
    }

    fetchDashboardModel = () => {
        if (this.props.dashboardId && !this.state.dashboard) {
            apiFetchDashboard(
                this.context.dataEngine,
                this.props.dashboardId
            ).then(dashboard => this.setState({ dashboard }))
        }
    }

    componentDidMount() {
        this.fetchDashboardModel()
    }

    componentDidUpdate() {
        this.fetchDashboardModel()
    }

    toggleTranslationDialog = () => {
        this.setState({
            translationDialogIsOpen: !this.state.translationDialogIsOpen,
        })
    }

    confirmDeleteDialog = () =>
        this.props.deleteAccess && this.props.dashboardId ? (
            <ConfirmDeleteDialog
                dashboardName={this.props.dashboardName}
                onDeleteConfirmed={this.onDeleteConfirmed}
                onContinueEditing={this.onContinueEditing}
                open={this.state.confirmDeleteDialogOpen}
            />
        ) : null

    translationDialog = () =>
        this.state.dashboard && this.state.dashboard.id ? (
            <TranslationDialog
                className="translation-dialog"
                d2={this.context.d2}
                open={this.state.translationDialogIsOpen}
                onRequestClose={this.toggleTranslationDialog}
                objectToTranslate={{
                    ...this.state.dashboard,
                    modelDefinition: { name: 'dashboard' },
                }}
                fieldsToTranslate={['name', 'description']}
                onTranslationSaved={this.onTranslationsSaved}
                onTranslationError={err =>
                    console.log('translation update error', err)
                }
            />
        ) : null

    renderActionButtons = () => (
        <ButtonStrip>
            <Button
                primary
                onClick={this.onSave}
                dataTest="save-dashboard-button"
            >
                {i18n.t('Save changes')}
            </Button>
            <Button onClick={this.onPrintPreview}>
                {this.props.isPrintPreviewView
                    ? i18n.t('Exit Print preview')
                    : i18n.t('Print preview')}
            </Button>

            {this.props.dashboardId && (
                <Button onClick={this.toggleTranslationDialog}>
                    {i18n.t('Translate')}
                </Button>
            )}
            {this.props.dashboardId && this.props.deleteAccess && (
                <Button
                    onClick={this.onConfirmDelete}
                    dataTest="delete-dashboard-button"
                >
                    {i18n.t('Delete')}
                </Button>
            )}
        </ButtonStrip>
    )

    render() {
        if (this.state.redirectUrl) {
            return <Redirect to={this.state.redirectUrl} />
        }

        const { updateAccess } = this.props

        const discardBtnText = updateAccess
            ? i18n.t('Exit without saving')
            : i18n.t('Go to dashboards')

        return (
            <>
                <div className={classes.editBar}>
                    <div className={classes.controls}>
                        {updateAccess ? this.renderActionButtons() : null}
                        <Button secondary onClick={this.onDiscard}>
                            {discardBtnText}
                        </Button>
                    </div>
                </div>
                {this.translationDialog()}
                {this.confirmDeleteDialog()}
            </>
        )
    }
}

EditBar.propTypes = {
    clearPrintDashboard: PropTypes.func,
    clearPrintPreview: PropTypes.func,
    dashboardId: PropTypes.string,
    dashboardName: PropTypes.string,
    deleteAccess: PropTypes.bool,
    isPrintPreviewView: PropTypes.bool,
    showPrintPreview: PropTypes.func,
    updateAccess: PropTypes.bool,
    onDelete: PropTypes.func,
    onDiscardChanges: PropTypes.func,
    onSave: PropTypes.func,
    onTranslate: PropTypes.func,
}

EditBar.contextTypes = {
    dataEngine: PropTypes.object,
    d2: PropTypes.object,
}

const mapStateToProps = state => {
    const dashboard = sGetEditDashboardRoot(state)

    let deleteAccess
    let updateAccess
    if (sGetIsNewDashboard(state)) {
        deleteAccess = true
        updateAccess = true
    } else {
        updateAccess = dashboard.access ? dashboard.access.update : false
        deleteAccess = dashboard.access ? dashboard.access.delete : false
    }

    return {
        dashboardId: dashboard.id,
        dashboardName: dashboard.name,
        deleteAccess,
        isPrintPreviewView: sGetIsPrintPreviewView(state),
        updateAccess,
    }
}

const mapDispatchToProps = dispatch => ({
    clearPrintDashboard: () => dispatch(acClearPrintDashboard()),
    clearPrintPreview: () => dispatch(acClearPrintPreviewView()),
    onSave: () => dispatch(tSaveDashboard()).then(id => id),
    onDelete: id => dispatch(tDeleteDashboard(id)),
    onDiscardChanges: () => dispatch(acClearEditDashboard()),
    onTranslate: (id, value) => dispatch(acSetDashboardDisplayName(id, value)),
    showPrintPreview: () => dispatch(acSetPrintPreviewView()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditBar)
