import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import i18n from '@dhis2/d2-i18n'
import TranslationDialog from '@dhis2/d2-ui-translation-dialog'
import { Button, ButtonStrip } from '@dhis2/ui'
import { useDataEngine, useAlert } from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'

import FilterSettingsDialog from '../ItemFilter/FilterSettingsDialog'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'
import {
    tSaveDashboard,
    acClearEditDashboard,
    acSetPrintPreviewView,
    acClearPrintPreviewView,
    acSetFilterSettings,
} from '../../actions/editDashboard'
import { acClearPrintDashboard } from '../../actions/printDashboard'
import {
    tDeleteDashboard,
    acSetDashboardDisplayName,
} from '../../actions/dashboards'
import { sGetDimensions } from '../../reducers/dimensions'
import {
    sGetEditDashboardRoot,
    sGetIsNewDashboard,
    sGetIsPrintPreviewView,
} from '../../reducers/editDashboard'
import { apiFetchDashboard } from '../../api/dashboards'

import classes from './styles/EditBar.module.css'

const saveFailedMessage = i18n.t(
    'Failed to save dashboard. You might be offline or not have access to edit this dashboard.'
)

const EditBar = props => {
    const { d2 } = useD2({})
    const dataEngine = useDataEngine()
    const [translationDlgIsOpen, setTranslationDlgIsOpen] = useState(false)
    const [filterSettingsDlgIsOpen, setFilterSettingsDlgIsOpen] = useState(
        false
    )
    const [dashboard, setDashboard] = useState(undefined)
    const [confirmDeleteDlgIsOpen, setConfirmDeleteDlgIsOpen] = useState(false)
    const [redirectUrl, setRedirectUrl] = useState(undefined)

    const failureAlert = useAlert(saveFailedMessage, {
        critical: true,
    })

    useEffect(() => {
        if (props.dashboardId && !dashboard) {
            apiFetchDashboard(dataEngine, props.dashboardId).then(dboard =>
                setDashboard(dboard)
            )
        }
    }, [props.dashboardId, dashboard])

    const onConfirmDelete = () => {
        setConfirmDeleteDlgIsOpen(true)
    }

    const onSave = () => {
        props
            .saveDashboard()
            .then(newId => {
                setRedirectUrl(`/${newId}`)
            })
            .catch(() => failureAlert.show())
    }

    const onPrintPreview = () => {
        if (props.isPrintPreviewView) {
            props.clearPrintPreview()
            props.clearPrintDashboard()
        } else {
            props.showPrintPreview()
        }
    }

    const onDiscard = () => {
        props.onDiscardChanges()
        const redirectUrl = props.dashboardId ? `/${props.dashboardId}` : '/'

        setRedirectUrl(redirectUrl)
    }

    const onContinueEditing = () => {
        setConfirmDeleteDlgIsOpen(false)
    }

    const onDeleteConfirmed = () => {
        setConfirmDeleteDlgIsOpen(false)
        props.onDelete(props.dashboardId).then(() => {
            setRedirectUrl('/')
        })
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

    const onTranslationsSaved = async translations => {
        if (translations && translations.length) {
            const dbLocale = await d2.currentUser.userSettings.get(
                'keyDbLocale'
            )

            const translation = translations.find(
                t => t.locale === dbLocale && t.property === 'NAME'
            )

            if (translation && translation.value) {
                props.onTranslate(props.dashboardId, translation.value)
            }
        }
    }

    const toggleTranslationDialog = () =>
        setTranslationDlgIsOpen(!translationDlgIsOpen)

    const toggleFilterSettingsDialog = () => {
        setFilterSettingsDlgIsOpen(!filterSettingsDlgIsOpen)
    }

    const confirmDeleteDialog = () =>
        props.deleteAccess && props.dashboardId ? (
            <ConfirmDeleteDialog
                dashboardName={props.dashboardName}
                onDeleteConfirmed={onDeleteConfirmed}
                onContinueEditing={onContinueEditing}
                open={confirmDeleteDlgIsOpen}
            />
        ) : null

    const translationDialog = () =>
        dashboard && dashboard.id ? (
            <TranslationDialog
                className="translation-dialog"
                d2={d2}
                open={translationDlgIsOpen}
                onRequestClose={toggleTranslationDialog}
                objectToTranslate={{
                    ...dashboard,
                    modelDefinition: { name: 'dashboard' },
                }}
                fieldsToTranslate={['name', 'description']}
                onTranslationSaved={onTranslationsSaved}
                onTranslationError={err =>
                    console.log('translation update error', err)
                }
            />
        ) : null

    const filterSettingsDialog = () =>
        dashboard || newDashboard ? (
            <FilterSettingsDialog
                dimensions={props.dimensions}
                restrictFilters={props.restrictFilters}
                initiallySelectedItems={props.allowedFilters}
                onClose={toggleFilterSettingsDialog}
                onConfirm={onFilterSettingsConfirmed}
                open={filterSettingsDlgIsOpen}
            />
        ) : null

    const renderActionButtons = () => (
        <ButtonStrip>
            <Button primary onClick={onSave} dataTest="save-dashboard-button">
                {i18n.t('Save changes')}
            </Button>
            <Button onClick={onPrintPreview}>
                {props.isPrintPreviewView
                    ? i18n.t('Exit Print preview')
                    : i18n.t('Print preview')}
            </Button>
            <Button onClick={toggleFilterSettingsDialog}>
                {i18n.t('Filter Settings')}
            </Button>
            {props.dashboardId && (
                <Button onClick={toggleTranslationDialog}>
                    {i18n.t('Translate')}
                </Button>
            )}
            {props.dashboardId && props.deleteAccess && (
                <Button
                    onClick={onConfirmDelete}
                    dataTest="delete-dashboard-button"
                >
                    {i18n.t('Delete')}
                </Button>
            )}
        </ButtonStrip>
    )

    if (redirectUrl) {
        return <Redirect to={redirectUrl} />
    }

    const { newDashboard, updateAccess } = props

    const discardBtnText = updateAccess
        ? i18n.t('Exit without saving')
        : i18n.t('Go to dashboards')

    return (
        <>
            <div className={classes.editBar}>
                <div className={classes.controls}>
                    {updateAccess ? renderActionButtons() : null}
                    <Button secondary onClick={onDiscard}>
                        {discardBtnText}
                    </Button>
                </div>
            </div>
            {filterSettingsDialog()}
            {translationDialog()}
            {confirmDeleteDialog()}
        </>
    )
}

EditBar.propTypes = {
    allowedFilters: PropTypes.array,
    clearPrintDashboard: PropTypes.func,
    clearPrintPreview: PropTypes.func,
    dashboardId: PropTypes.string,
    dashboardName: PropTypes.string,
    deleteAccess: PropTypes.bool,
    dimensions: PropTypes.array,
    isPrintPreviewView: PropTypes.bool,
    newDashboard: PropTypes.bool,
    restrictFilters: PropTypes.bool,
    saveDashboard: PropTypes.func,
    setFilterSettings: PropTypes.func,
    showPrintPreview: PropTypes.func,
    updateAccess: PropTypes.bool,
    onDelete: PropTypes.func,
    onDiscardChanges: PropTypes.func,
    onTranslate: PropTypes.func,
}

const mapStateToProps = state => {
    const dashboard = sGetEditDashboardRoot(state)
    console.log(dashboard)
    let newDashboard
    let deleteAccess
    let updateAccess
    if (sGetIsNewDashboard(state)) {
        newDashboard = true
        deleteAccess = true
        updateAccess = true
    } else {
        newDashboard = false
        updateAccess = dashboard.access ? dashboard.access.update : false
        deleteAccess = dashboard.access ? dashboard.access.delete : false
    }

    return {
        allowedFilters: dashboard.allowedFilters,
        dashboardId: dashboard.id,
        dashboardName: dashboard.name,
        deleteAccess,
        dimensions: sGetDimensions(state),
        newDashboard,
        restrictFilters: dashboard.restrictFilters,
        isPrintPreviewView: sGetIsPrintPreviewView(state),
        updateAccess,
    }
}

const mapDispatchToProps = dispatch => ({
    clearPrintDashboard: () => dispatch(acClearPrintDashboard()),
    clearPrintPreview: () => dispatch(acClearPrintPreviewView()),
    saveDashboard: () => dispatch(tSaveDashboard()).then(id => id),
    onDelete: id => dispatch(tDeleteDashboard(id)),
    onDiscardChanges: () => dispatch(acClearEditDashboard()),
    onTranslate: (id, value) => dispatch(acSetDashboardDisplayName(id, value)),
    setFilterSettings: value => dispatch(acSetFilterSettings(value)),
    showPrintPreview: () => dispatch(acSetPrintPreviewView()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditBar)
