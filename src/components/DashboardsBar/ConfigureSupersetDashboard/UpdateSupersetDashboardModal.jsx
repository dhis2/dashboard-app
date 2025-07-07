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
import React, { useEffect, useRef } from 'react'
import { useSupersetDashboardFieldsState } from '../../../modules/useSupersetDashboardFieldsState.js'
import { useSupersetDashboardMutation } from '../../../modules/useSupersetDashboardMutation.js'
import styles from './styles/SupersetDashboardModal.module.css'
import { SupersetDashboardFields } from './SupersetDashboardFields.jsx'

const FORM_ID = 'update-superset-dashboard'

export const UpdateSupersetDashboardModal = ({ closeModal }) => {
    const formRef = useRef(null)
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
    } = useSupersetDashboardMutation({ closeModal })
    const {
        hasFieldChanges,
        isSupersetEmbedIdValid,
        isCodeValid,
        shouldShowSupersetEmbedIdError,
        values,
        onChange,
        onSupersetEmbedIdFieldBlur,
        resetFieldsStateWithNewValues,
    } = useSupersetDashboardFieldsState()

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
            formRef.current?.getElementsByTagName('input')?.item(0)?.focus()
        }
    }, [dashboard, resetFieldsStateWithNewValues])

    if (showDeleteConfirmDialog) {
        return (
            <Modal>
                <ModalTitle>{i18n.t('Delete dashboard')}</ModalTitle>
                <ModalContent className={styles.confirmDeleteTextWrap}>
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
                            className={styles.confirmDeleteButton}
                            initialFocus
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
                <form
                    ref={formRef}
                    id={FORM_ID}
                    onSubmit={(event) => {
                        event.preventDefault()
                        handleUpdate(values)
                    }}
                >
                    <SupersetDashboardFields
                        shouldShowSupersetEmbedIdError={
                            shouldShowSupersetEmbedIdError
                        }
                        isCodeValid={isCodeValid}
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
                </form>
            </ModalContent>
            <div className={styles.fullWidthModalActions}>
                <div className={styles.buttonStrip}>
                    {!queryHasError && (
                        <Button
                            loading={mutationLoading}
                            primary
                            type="submit"
                            disabled={
                                !hasFieldChanges ||
                                !isSupersetEmbedIdValid ||
                                !isCodeValid ||
                                queryLoading
                            }
                            form={FORM_ID}
                        >
                            {i18n.t('Save dashboard')}
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
                            {i18n.t('Delete dashboard')}
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    )
}

UpdateSupersetDashboardModal.propTypes = {
    closeModal: PropTypes.func,
}
