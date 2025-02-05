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
import React, { useEffect } from 'react'
import { useSupersetEmbeddedDashboardFieldsState } from '../../modules/useSupersetEmbeddedDashboardFieldsState.js'
import { useSupersetEmbeddedDashboardMutation } from '../../modules/useSupersetEmbeddedDashboardMutation.js'
import styles from './styles/SupersetEmbeddedDashboardModal.module.css'
import { SupersetEmbeddedDashboardFields } from './SupersetEmbeddedDashboardFields.js'

export const UpdateSupersetEmbeddedDashboard = ({ closeModal }) => {
    const {
        queryLoading,
        queryHasError,
        queryErrorTitle,
        queryErrorMessage,
        mutationLoading,
        mutationHasError,
        mutationErrorTitle,
        mutationErrorText,
        dashboard,
        showDeleteConfirmDialog,
        setShowDeleteConfirmDialog,
        handleUpdate,
        handleDelete,
    } = useSupersetEmbeddedDashboardMutation({ closeModal })
    const {
        hasFieldChanges,
        isSupersetEmbedIdValid,
        isSupersetEmbedIdFieldTouched,
        values,
        onChange,
        onSupersetEmbedIdFieldBlur,
        resetFieldsStateWithNewValues,
    } = useSupersetEmbeddedDashboardFieldsState()

    useEffect(() => {
        if (dashboard) {
            resetFieldsStateWithNewValues({
                title: dashboard.name,
                code: dashboard.code,
                description: dashboard.description,
                supersetEmbedId: dashboard.embedded.id,
                showChartControls:
                    !dashboard.embedded.options.hideChartControls,
                expandFilters: dashboard.embedded.options.filters.expanded,
            })
        }
    }, [dashboard, resetFieldsStateWithNewValues])

    if (showDeleteConfirmDialog) {
        return (
            <Modal>
                <ModalTitle>{i18n.t('Delete dashboard')}</ModalTitle>
                <ModalContent>
                    <p className={styles.deleteConfirmPrimaryMessage}>
                        {i18n.t(
                            'Deleting dashboard "{{ dashboardName }}" will remove it for all users. This action cannot be undone. Are you sure you want to permanently delete this dashboard?',
                            { dashboardName: dashboard.name }
                        )}
                    </p>
                    <p className={styles.deleteConfirmSecondaryMessage}>
                        {i18n.t(
                            'Note: the source dashboard embedded by this external dashboard will not be deleted.',
                            { nsSeparator: '###' }
                        )}
                    </p>
                </ModalContent>
                <ModalActions>
                    <div className={styles.buttonStrip}>
                        <Button
                            loading={mutationLoading}
                            destructive
                            onClick={(_, event) => {
                                event.preventDefault()
                                handleDelete()
                            }}
                        >
                            {i18n.t('Delete')}
                        </Button>
                        <Button
                            secondary
                            onClick={() => setShowDeleteConfirmDialog(false)}
                            disabled={mutationLoading}
                        >
                            {i18n.t('Cancel')}
                        </Button>
                    </div>
                </ModalActions>
            </Modal>
        )
    }

    return (
        <Modal>
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    handleUpdate(values)
                }}
            >
                <ModalTitle>{i18n.t('Edit external dashboard')}</ModalTitle>
                <ModalContent className={styles.modalContent}>
                    {(queryLoading || queryHasError) && (
                        <div
                            className={cx(styles.contentOverlay, {
                                [styles.loading]: queryLoading,
                                [styles.error]: queryHasError,
                            })}
                        >
                            {queryLoading && <CircularLoader />}
                            {queryHasError && (
                                <NoticeBox error title={queryErrorTitle}>
                                    {queryErrorMessage}
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
                    {mutationHasError && (
                        <NoticeBox error title={mutationErrorTitle}>
                            {mutationErrorText}
                        </NoticeBox>
                    )}
                </ModalContent>
                <ModalActions>
                    <div className={styles.buttonStrip}>
                        {!queryHasError && (
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
                            secondary={!queryHasError}
                            primary={queryHasError}
                            onClick={closeModal}
                            type={queryHasError ? 'submit' : undefined}
                        >
                            {i18n.t('Cancel')}
                        </Button>
                        {!queryHasError && dashboard?.access?.delete && (
                            <Button
                                destructive
                                disabled={queryLoading || mutationLoading}
                                secondary
                                onClick={() => setShowDeleteConfirmDialog(true)}
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
