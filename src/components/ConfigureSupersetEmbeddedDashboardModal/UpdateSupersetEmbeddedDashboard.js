import { useDataMutation, useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    CircularLoader,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    NoticeBox,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { tFetchDashboards } from '../../actions/dashboards.js'
import {
    acClearSelected,
    tSetSelectedDashboardById,
} from '../../actions/selected.js'
import { parseSupersetEmbeddedDashboardFieldValues } from '../../modules/parseSupersetEmbeddedDashboardFieldValues.js'
import { useSupersetEmbeddedDashboardFieldsState } from '../../modules/useSupersetEmbeddedDashboardFieldsState.js'
import { sGetSelectedId } from '../../reducers/selected.js'
import styles from './styles/SupersetEmbeddedDashboardModal.module.css'
import { SupersetEmbeddedDashboardFields } from './SupersetEmbeddedDashboardFields.js'

const getDashboardQuery = {
    dashboard: {
        resource: 'dashboards',
        id: ({ id }) => id,
        params: {
            fields: ['name', 'code', 'description', 'access', 'embedded[*]'],
        },
    },
}
const updateDashboardQuery = {
    resource: 'dashboards',
    type: 'update',
    id: ({ id }) => id,
    data: ({ values }) => parseSupersetEmbeddedDashboardFieldValues(values),
    params: {
        skipTranslation: true,
        skipSharing: true,
    },
}
const deleteDashboardQuery = {
    resource: 'dashboards',
    type: 'delete',
    id: ({ id }) => id,
}

const parseErrorText = (error) =>
    error?.details?.response?.errorReports[0]?.message ??
    i18n.t('An unknown error occurred')

export const UpdateSupersetEmbeddedDashboard = ({ closeModal }) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const id = useSelector(sGetSelectedId)
    const {
        loading: queryLoading,
        error: queryError,
        data: queryData,
    } = useDataQuery(getDashboardQuery, { variables: { id } })
    const dashboard = queryData?.dashboard
    const name = dashboard?.name
    const [mutationLoading, setMutationLoading] = useState(false)
    const handeMutationError = useCallback(() => setMutationLoading(false), [])
    const [updateDashboard, { error: updateError }] = useDataMutation(
        updateDashboardQuery,
        { variables: { id }, onError: handeMutationError }
    )
    const [deleteDashboard, { error: deleteError }] = useDataMutation(
        deleteDashboardQuery,
        { variables: { id }, onError: handeMutationError }
    )
    const mutationError = updateError || deleteError
    const mutationErrorTitle = updateError
        ? i18n.t('Could not update dashboard {{name}}', { name })
        : i18n.t('Could not delete dashboard {{name}}', { name })
    const mutationErrorText = parseErrorText(mutationError)
    const {
        hasFieldChanges,
        isSupersetEmbedIdValid,
        isSupersetEmbedIdFieldTouched,
        values,
        onChange,
        onSupersetEmbedIdFieldBlur,
        resetStateWithNewValues,
    } = useSupersetEmbeddedDashboardFieldsState()
    const handleSubmit = useCallback(
        async (event) => {
            event.preventDefault()
            setMutationLoading(true)
            await updateDashboard({ values })
            await dispatch(tSetSelectedDashboardById(id))
            setMutationLoading(false)
            closeModal()
        },
        [values, updateDashboard, closeModal, dispatch, id]
    )
    const handleDelete = useCallback(
        async (_, event) => {
            event.preventDefault()
            setMutationLoading(true)
            await deleteDashboard()
            dispatch(acClearSelected())
            await dispatch(tFetchDashboards())
            setMutationLoading(false)
            closeModal()
            history.push('/')
        },
        [deleteDashboard, closeModal, dispatch, history]
    )

    useEffect(() => {
        if (dashboard) {
            resetStateWithNewValues({
                title: dashboard.name,
                code: dashboard.code,
                description: dashboard.description,
                supersetEmbedId: dashboard.embedded.id,
                showChartControls:
                    !dashboard.embedded.options.hideChartControls,
                showFilters: dashboard.embedded.options.filters.visible,
            })
        }
    }, [dashboard, resetStateWithNewValues])

    return (
        <Modal>
            <form onSubmit={handleSubmit}>
                <ModalTitle>
                    {i18n.t('Edit external dashboard', { nsSeparator: '###' })}
                </ModalTitle>
                <ModalContent className={styles.modalContent}>
                    {(queryLoading || !!queryError) && (
                        <div
                            className={cx(styles.contentOverlay, {
                                [styles.loading]: queryLoading,
                                [styles.error]: queryError,
                            })}
                        >
                            {queryLoading && <CircularLoader />}
                            {queryError && (
                                <NoticeBox
                                    error
                                    title={i18n.t(
                                        'Could not load dashboard details'
                                    )}
                                >
                                    {parseErrorText(queryError)}
                                </NoticeBox>
                            )}
                        </div>
                    )}
                    <SupersetEmbeddedDashboardFields
                        isSupersetEmbedIdValid={isSupersetEmbedIdValid}
                        isSupersetEmbedIdFieldTouched={
                            isSupersetEmbedIdFieldTouched
                        }
                        values={values}
                        onChange={onChange}
                        onSupersetEmbedIdFieldBlur={onSupersetEmbedIdFieldBlur}
                        submitting={mutationLoading || queryLoading}
                    />
                    {mutationError && (
                        <NoticeBox error title={mutationErrorTitle}>
                            {mutationErrorText}
                        </NoticeBox>
                    )}
                </ModalContent>
                <ModalActions>
                    <div className={styles.buttonStrip}>
                        {!queryError && (
                            <Button
                                loading={mutationLoading}
                                type="submit"
                                primary
                                disabled={
                                    !hasFieldChanges ||
                                    !isSupersetEmbedIdValid ||
                                    queryLoading
                                }
                            >
                                {i18n.t('Update dashboard')}
                            </Button>
                        )}
                        <Button
                            disabled={mutationLoading}
                            secondary={!queryError}
                            primary={!!queryError}
                            onClick={closeModal}
                            type={queryError ? 'submit' : undefined}
                        >
                            {i18n.t('Cancel')}
                        </Button>
                        {!queryError && dashboard?.access?.delete && (
                            <Button
                                destructive
                                disabled={mutationLoading || queryLoading}
                                secondary
                                onClick={handleDelete}
                                className={styles.deleteButton}
                            >
                                {i18n.t('Delete')}
                            </Button>
                        )}
                    </div>
                </ModalActions>
            </form>
        </Modal>
    )
}

UpdateSupersetEmbeddedDashboard.propTypes = {
    closeModal: PropTypes.func,
}
