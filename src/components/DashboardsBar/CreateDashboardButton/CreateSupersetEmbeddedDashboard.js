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

export const CreateSupersetEmbeddedDashboard = ({
    backToChooseDashboardModal,
    closeModal,
}) => {
    const postNewDashboard = () => {
        console.log('POSTING...')
        closeModal()
    }
    return (
        <Modal>
            <form onSubmit={postNewDashboard}>
                <ModalTitle>
                    {i18n.t(
                        'New dashboard: configure external source (suprset)',
                        { nsSeparator: '###' }
                    )}
                </ModalTitle>
                <ModalContent>Show the form</ModalContent>
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
