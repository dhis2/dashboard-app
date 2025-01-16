import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useSupersetEmbeddedDashboardFieldsState } from '../../../modules/useSupersetEmbeddedDashboardFieldsState.js'
import { SupersetEmbeddedDashboardFields } from '../../SupersetEmbeddedDashboardFields.js'

export const CreateSupersetEmbeddedDashboard = ({
    backToChooseDashboardModal,
    closeModal,
}) => {
    const {
        isSupersetEmbedIdValid,
        isSupersetEmbedIdFieldTouched,
        values,
        onChange,
        onSupersetEmbedIdFieldBlur,
    } = useSupersetEmbeddedDashboardFieldsState()
    const postNewDashboard = () => {
        console.log('POSTING...')
        closeModal()
    }
    return (
        <Modal>
            <form onSubmit={postNewDashboard}>
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
                    />
                </ModalContent>
                <ModalActions>
                    <ButtonStrip>
                        <Button secondary onClick={backToChooseDashboardModal}>
                            {i18n.t('Back')}
                        </Button>
                        <Button type="submit" primary>
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
