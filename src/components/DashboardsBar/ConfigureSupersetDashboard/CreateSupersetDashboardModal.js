import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    NoticeBox,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { parseSupersetDashboardFieldValues } from '../../../modules/parseSupersetDashboardFieldValues.js'
import { useSupersetDashboardFieldsState } from '../../../modules/useSupersetDashboardFieldsState.js'
import styles from './styles/SupersetDashboardModal.module.css'
import { SupersetDashboardFields } from './SupersetDashboardFields.js'

const postDashboardQuery = {
    resource: 'dashboards',
    type: 'create',
    data: ({ values }) => parseSupersetDashboardFieldValues(values),
}
const FORM_ID = 'create-superset-dashboard'

export const CreateSupersetDashboardModal = ({
    backToChooseDashboardModal,
    closeModal,
}) => {
    const history = useHistory()
    const [loading, setLoading] = useState(false)
    const [postDashboard, { error }] = useDataMutation(postDashboardQuery, {
        onError: () => setLoading(false),
    })
    const {
        hasFieldChanges,
        isSupersetEmbedIdValid,
        isCodeValid,
        shouldShowSupersetEmbedIdError,
        values,
        onChange,
        onSupersetEmbedIdFieldBlur,
    } = useSupersetDashboardFieldsState()
    const handleSubmit = useCallback(
        async (event) => {
            event.preventDefault()
            setLoading(true)
            const { response } = await postDashboard({ values })
            setLoading(false)
            closeModal()
            history.push(`/${response.uid}`)
        },
        [values, postDashboard, closeModal, history]
    )

    return (
        <Modal>
            <ModalTitle>
                {i18n.t('New dashboard: external', { nsSeparator: '###' })}
            </ModalTitle>
            <ModalContent>
                <form onSubmit={handleSubmit} id={FORM_ID}>
                    <SupersetDashboardFields
                        shouldShowSupersetEmbedIdError={
                            shouldShowSupersetEmbedIdError
                        }
                        values={values}
                        onChange={onChange}
                        onSupersetEmbedIdFieldBlur={onSupersetEmbedIdFieldBlur}
                        submitting={loading}
                        isCodeValid={isCodeValid}
                    />
                </form>
                {error && (
                    <NoticeBox
                        error
                        title={i18n.t('Could not create dashboard')}
                    >
                        {error?.details?.response?.errorReports[0]?.message ??
                            i18n.t('An unknown error occurred')}
                    </NoticeBox>
                )}
            </ModalContent>
            <ModalActions>
                <div className={styles.buttonStrip}>
                    <Button
                        loading={loading}
                        type="submit"
                        primary
                        disabled={
                            !hasFieldChanges ||
                            !isSupersetEmbedIdValid ||
                            !isCodeValid
                        }
                        form={FORM_ID}
                    >
                        {i18n.t('Save dashboard')}
                    </Button>
                    <Button
                        disabled={loading}
                        secondary
                        onClick={backToChooseDashboardModal}
                    >
                        {i18n.t('Back')}
                    </Button>
                </div>
            </ModalActions>
        </Modal>
    )
}

CreateSupersetDashboardModal.propTypes = {
    backToChooseDashboardModal: PropTypes.func,
    closeModal: PropTypes.func,
}
