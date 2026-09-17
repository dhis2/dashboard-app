import { OfflineTooltip, TranslationDialog } from '@dhis2/analytics'
import {
    useDhis2ConnectionStatus,
    useDataEngine,
    useAlert,
} from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    IconView16,
    IconFilter16,
    IconTranslate16,
    IconDelete16,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { tFetchDashboards } from '../../actions/dashboards.js'
import {
    tSaveDashboard,
    acClearEditDashboard,
    acSetPrintPreviewView,
    acClearPrintPreviewView,
    acSetFilterSettings,
} from '../../actions/editDashboard.js'
import { acClearPrintDashboard } from '../../actions/printDashboard.js'
import { acClearSelected } from '../../actions/selected.js'
import ConfirmActionDialog from '../../components/ConfirmActionDialog.jsx'
import {
    sGetEditDashboardRoot,
    sGetIsPrintPreviewView,
    sGetEditIsDirty,
    sGetLayoutColumns,
} from '../../reducers/editDashboard.js'
import { deleteDashboardMutation } from './deleteDashboardMutation.js'
import FilterSettingsDialog from './FilterSettingsDialog.jsx'
import InlineButton from './InlineButton.jsx'
import InlineTitleEditor from './InlineTitleEditor.jsx'
import classes from './styles/ActionsBar.module.css'

const saveFailedMessage = i18n.t(
    'Failed to save dashboard. You might be offline or not have access to edit this dashboard.'
)

const saveFailedCodeExistsMessage = i18n.t(
    'Failed to save dashboard. This code is already being used on another dashboard.'
)

const deleteFailedMessage = i18n.t(
    'Failed to delete dashboard. You might be offline or not have access to edit this dashboard.'
)

const fieldsToTranslate = ['name', 'description']

const EditBar = ({ dashboard, ...props }) => {
    const dataEngine = useDataEngine()
    const { isConnected: online } = useDhis2ConnectionStatus()
    const [translationDlgIsOpen, setTranslationDlgIsOpen] = useState(false)
    const [filterSettingsDlgIsOpen, setFilterSettingsDlgIsOpen] =
        useState(false)
    const [confirmDeleteDlgIsOpen, setConfirmDeleteDlgIsOpen] = useState(false)
    const [confirmDiscardDlgIsOpen, setConfirmDiscardDlgIsOpen] =
        useState(false)

    const [redirectUrl, setRedirectUrl] = useState(undefined)

    const saveFailureAlert = useAlert(saveFailedMessage, {
        critical: true,
    })

    const saveFailureCodeExistsAlert = useAlert(saveFailedCodeExistsMessage, {
        critical: true,
    })

    const deleteFailureAlert = useAlert(deleteFailedMessage, {
        critical: true,
    })

    const onConfirmDelete = () => {
        setConfirmDeleteDlgIsOpen(true)
    }

    const onDeleteConfirmed = () => {
        setConfirmDeleteDlgIsOpen(false)

        dataEngine
            .mutate(deleteDashboardMutation, {
                variables: { id: dashboard.id },
            })
            .then(() => {
                props.clearSelected()

                return props.fetchDashboards()
            })
            .then(() => setRedirectUrl('/'))
            .catch(deleteFailureAlert.show)
    }

    const onSave = () => {
        props
            .saveDashboard()
            .then((newId) => {
                props.clearSelected()
                setRedirectUrl(`/${newId}`)
            })
            .catch((e) => {
                if (
                    e.details.httpStatusCode === 409 &&
                    e.details.response?.errorReports?.at(0)?.errorCode ===
                        'E5003'
                ) {
                    saveFailureCodeExistsAlert.show()
                } else {
                    saveFailureAlert.show()
                }
            })
    }

    const onPrintPreview = () => {
        if (props.isPrintPreviewView) {
            props.clearPrintPreview()
            props.clearPrintDashboard()
        } else {
            props.showPrintPreview()
        }
    }

    const onDiscardConfirmed = () => {
        props.onDiscardChanges()
        const redirectUrl = dashboard.id ? `/${dashboard.id}` : '/'

        setRedirectUrl(redirectUrl)
    }

    const onContinueEditing = () => {
        setConfirmDeleteDlgIsOpen(false)
        setConfirmDiscardDlgIsOpen(false)
    }

    const onFilterSettingsConfirmed = (
        filterSettingsRestrictability,
        selectedFilters
    ) => {
        const allowedFilters = filterSettingsRestrictability
            ? selectedFilters
            : []
        props.setFilterSettings({
            allowedFilters,
            restrictFilters: filterSettingsRestrictability,
        })
        toggleFilterSettingsDialog()
    }

    const toggleTranslationDialog = () =>
        setTranslationDlgIsOpen(!translationDlgIsOpen)

    const toggleFilterSettingsDialog = () => {
        setFilterSettingsDlgIsOpen(!filterSettingsDlgIsOpen)
    }

    const translationDialog = () =>
        translationDlgIsOpen ? (
            <TranslationDialog
                className="translation-dialog"
                objectToTranslate={dashboard}
                fieldsToTranslate={fieldsToTranslate}
                onClose={toggleTranslationDialog}
                onTranslationSaved={toggleTranslationDialog}
            />
        ) : null

    const filterSettingsDialog = () => {
        return (
            <FilterSettingsDialog
                restrictFilters={dashboard.restrictFilters}
                initiallySelectedItems={dashboard.allowedFilters}
                onClose={toggleFilterSettingsDialog}
                onConfirm={onFilterSettingsConfirmed}
                open={filterSettingsDlgIsOpen}
            />
        )
    }

    const canUpdate = dashboard.access?.update

    if (redirectUrl) {
        return <Redirect to={redirectUrl} />
    }

    return (
        <>
            <div className={classes.editBar} data-test="edit-control-bar">
                <div className={classes.center}>
                    {canUpdate && !props.isPrintPreviewView && (
                        <InlineTitleEditor />
                    )}
                </div>

                <div className={classes.right}>
                    <OfflineTooltip>
                        <InlineButton
                            icon={<IconView16 />}
                            disabled={!online}
                            onClick={onPrintPreview}
                        >
                            {props.isPrintPreviewView
                                ? i18n.t('Exit preview')
                                : i18n.t('Preview')}
                        </InlineButton>
                    </OfflineTooltip>
                    {canUpdate && !props.isPrintPreviewView && (
                        <OfflineTooltip>
                            <InlineButton
                                icon={<IconFilter16 />}
                                disabled={!online}
                                onClick={toggleFilterSettingsDialog}
                            >
                                {i18n.t('Filters')}
                            </InlineButton>
                        </OfflineTooltip>
                    )}
                    {canUpdate && !props.isPrintPreviewView && (
                        <OfflineTooltip
                            disabled={!dashboard.id}
                            content={
                                dashboard.id
                                    ? undefined
                                    : i18n.t(
                                          'Save the dashboard before adding translations'
                                      )
                            }
                        >
                            <InlineButton
                                icon={<IconTranslate16 />}
                                disabled={!online || !dashboard.id}
                                onClick={toggleTranslationDialog}
                            >
                                {i18n.t('Translate')}
                            </InlineButton>
                        </OfflineTooltip>
                    )}
                    {!props.isPrintPreviewView &&
                        (dashboard.access?.delete || !dashboard.id) && (
                            <OfflineTooltip
                                disabledWhenOffline={Boolean(dashboard.id)}
                                content={i18n.t(
                                    'Cannot delete this dashboard while offline'
                                )}
                            >
                                <InlineButton
                                    destructive
                                    icon={<IconDelete16 />}
                                    disabled={Boolean(dashboard.id) && !online}
                                    onClick={
                                        dashboard.id
                                            ? onConfirmDelete
                                            : onDiscardConfirmed
                                    }
                                    dataTest="delete-dashboard-button"
                                >
                                    {i18n.t('Delete')}
                                </InlineButton>
                            </OfflineTooltip>
                        )}
                    {!props.isPrintPreviewView && (
                        <>
                            <span className={classes.divider} />
                            <InlineButton onClick={onDiscardConfirmed}>
                                {canUpdate
                                    ? i18n.t('Cancel')
                                    : i18n.t('Go to dashboards')}
                            </InlineButton>
                            {canUpdate && (
                                <OfflineTooltip
                                    content={i18n.t(
                                        'Cannot save this dashboard while offline'
                                    )}
                                >
                                    <Button
                                        disabled={!online}
                                        primary
                                        small
                                        onClick={onSave}
                                        dataTest="save-dashboard-button"
                                    >
                                        {i18n.t('Save changes')}
                                    </Button>
                                </OfflineTooltip>
                            )}
                        </>
                    )}
                </div>
            </div>
            {dashboard.access?.update && filterSettingsDialog()}
            {dashboard.id && dashboard.access?.update && translationDialog()}
            {dashboard.id && dashboard.access?.delete && (
                <ConfirmActionDialog
                    title={i18n.t('Delete dashboard')}
                    message={i18n.t(
                        'Deleting dashboard "{{- dashboardName }}" will remove it for all users. This action cannot be undone. Are you sure you want to permanently delete this dashboard?',
                        { dashboardName: dashboard.name }
                    )}
                    cancelLabel={i18n.t('Cancel')}
                    confirmLabel={i18n.t('Delete')}
                    onConfirm={onDeleteConfirmed}
                    onCancel={onContinueEditing}
                    open={confirmDeleteDlgIsOpen}
                />
            )}
            <ConfirmActionDialog
                title={i18n.t('Discard changes')}
                message={i18n.t(
                    'This dashboard has unsaved changes. Are you sure you want to leave and discard these unsaved changes?'
                )}
                cancelLabel={i18n.t('No, stay here')}
                confirmLabel={i18n.t('Yes, discard changes')}
                onConfirm={onDiscardConfirmed}
                onCancel={onContinueEditing}
                open={confirmDiscardDlgIsOpen}
            />
        </>
    )
}

EditBar.propTypes = {
    clearPrintDashboard: PropTypes.func,
    clearPrintPreview: PropTypes.func,
    clearSelected: PropTypes.func,
    columns: PropTypes.array,
    dashboard: PropTypes.object,
    fetchDashboards: PropTypes.func,
    isDirty: PropTypes.bool,
    isPrintPreviewView: PropTypes.bool,
    saveDashboard: PropTypes.func,
    setFilterSettings: PropTypes.func,
    showPrintPreview: PropTypes.func,
    onAutoLayoutSelect: PropTypes.func,
    onDiscardChanges: PropTypes.func,
}

const mapStateToProps = (state) => ({
    columns:
        sGetLayoutColumns(state) ||
        [...Array(5).keys()].map((i) => ({ index: i })),
    dashboard: sGetEditDashboardRoot(state),
    isPrintPreviewView: sGetIsPrintPreviewView(state),
    isDirty: sGetEditIsDirty(state),
})

const mapDispatchToProps = {
    clearPrintDashboard: () => (dispatch) => dispatch(acClearPrintDashboard()),
    clearPrintPreview: () => (dispatch) => dispatch(acClearPrintPreviewView()),
    clearSelected: () => (dispatch) => dispatch(acClearSelected()),
    saveDashboard: () => (dispatch) =>
        dispatch(tSaveDashboard()).then((id) => id),
    fetchDashboards: () => (dispatch) => dispatch(tFetchDashboards()),
    onDiscardChanges: () => (dispatch) => dispatch(acClearEditDashboard()),
    setFilterSettings: (value) => (dispatch) =>
        dispatch(acSetFilterSettings(value)),
    showPrintPreview: () => (dispatch) => dispatch(acSetPrintPreviewView()),
}

export default connect(mapStateToProps, mapDispatchToProps)(EditBar)
