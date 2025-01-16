import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    NoticeBox,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { tFetchDashboards } from '../../../actions/dashboards.js'
import { useSupersetEmbeddedDashboardFieldsState } from '../../../modules/useSupersetEmbeddedDashboardFieldsState.js'
import { SupersetEmbeddedDashboardFields } from '../../SupersetEmbeddedDashboardFields.js'

const postDashboardQuery = {
    resource: 'dashboards',
    type: 'create',
    data: ({ values }) => ({
        name: values.title || 'Untitled dashboard',
        description: values.description,
        code: values.code,
        embedded: {
            provider: 'SUPERSET',
            id: values.supersetEmbedId,
            options: {
                hideTab: false,
                hideChartControls: !values.showChartControls,
                filters: {
                    visible: values.showFilters,
                    expanded: false,
                },
            },
        },
    }),
}

export const CreateSupersetEmbeddedDashboard = ({
    backToChooseDashboardModal,
    closeModal,
}) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const [loading, setLoading] = useState(false)
    const [postDashboard, { error }] = useDataMutation(postDashboardQuery)
    const {
        hasFieldChanges,
        isSupersetEmbedIdValid,
        isSupersetEmbedIdFieldTouched,
        values,
        onChange,
        onSupersetEmbedIdFieldBlur,
    } = useSupersetEmbeddedDashboardFieldsState()
    const handleSubmit = useCallback(
        async (event) => {
            event.preventDefault()
            setLoading(true)
            const { response } = await postDashboard({ values })
            await dispatch(tFetchDashboards())
            closeModal()
            history.push(`/${response.uid}`)
        },
        [values, postDashboard]
    )

    return (
        <Modal>
            <form onSubmit={handleSubmit} ref={(element) => element?.focus()}>
                <ModalTitle>
                    {i18n.t(
                        'New dashboard: configure external source (superset)',
                        { nsSeparator: '###' }
                    )}
                </ModalTitle>
                <ModalContent>
                    <SupersetEmbeddedDashboardFields
                        isSupersetEmbedIdValid={isSupersetEmbedIdValid}
                        isSupersetEmbedIdFieldTouched={
                            isSupersetEmbedIdFieldTouched
                        }
                        values={values}
                        onChange={onChange}
                        onSupersetEmbedIdFieldBlur={onSupersetEmbedIdFieldBlur}
                        submitting={loading}
                    />
                    {error && (
                        <NoticeBox
                            error
                            title={i18n.t('Could not create dashboard')}
                        >
                            {error?.details?.response?.errorReports[0]
                                ?.message ??
                                i18n.t('An unknown error occurred')}
                        </NoticeBox>
                    )}
                </ModalContent>
                <ModalActions>
                    <ButtonStrip>
                        <Button
                            disabled={loading}
                            secondary
                            onClick={backToChooseDashboardModal}
                        >
                            {i18n.t('Back')}
                        </Button>
                        <Button
                            loading={loading}
                            type="submit"
                            primary
                            disabled={
                                !hasFieldChanges || !isSupersetEmbedIdValid
                            }
                        >
                            {i18n.t('Save dashboard')}
                        </Button>
                    </ButtonStrip>
                </ModalActions>
            </form>
        </Modal>
    )
}

CreateSupersetEmbeddedDashboard.propTypes = {
    backToChooseDashboardModal: PropTypes.func,
    closeModal: PropTypes.func,
}
