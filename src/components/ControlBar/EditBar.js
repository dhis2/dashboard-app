import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import i18n from '@dhis2/d2-i18n'
import TranslationDialog from '@dhis2/d2-ui-translation-dialog'
import { Button, ButtonStrip } from '@dhis2/ui'
import { useDataEngine } from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'

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

const EditBar = props => {
    const { d2 } = useD2({})
    const dataEngine = useDataEngine()
    const [translationDlgIsOpen, setTranslationDlgIsOpen] = useState(false)
    const [dashboard, setDashboard] = useState(undefined)
    const [confirmDeleteDlgIsOpen, setConfirmDeleteDlgIsOpen] = useState(false)
    const [redirectUrl, setRedirectUrl] = useState(undefined)

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
        props.onSave().then(newId => {
            setRedirectUrl(`/${newId}`)
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

    const { updateAccess } = props

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
            {translationDialog()}
            {confirmDeleteDialog()}
        </>
    )
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
