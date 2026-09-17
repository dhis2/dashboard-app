import i18n from '@dhis2/d2-i18n'
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button,
    TextAreaField,
    InputField,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import {
    acSetDashboardCode,
    acSetDashboardDescription,
} from '../../actions/editDashboard.js'
import {
    sGetEditDashboardCode,
    sGetEditDashboardDescription,
} from '../../reducers/editDashboard.js'

const DetailsModal = ({
    onClose,
    description,
    code,
    setDescription,
    setCode,
}) => (
    <Modal onClose={onClose} position="middle">
        <ModalTitle>{i18n.t('Dashboard details')}</ModalTitle>
        <ModalContent>
            <TextAreaField
                label={i18n.t('Description')}
                value={description || ''}
                onChange={({ value }) => setDescription(value)}
                rows={4}
            />
            <div style={{ height: 16 }} />
            <InputField
                label={i18n.t('Code')}
                value={code || ''}
                onChange={({ value }) => setCode(value)}
            />
        </ModalContent>
        <ModalActions>
            <ButtonStrip end>
                <Button primary onClick={onClose}>
                    {i18n.t('Done')}
                </Button>
            </ButtonStrip>
        </ModalActions>
    </Modal>
)

DetailsModal.propTypes = {
    code: PropTypes.string,
    description: PropTypes.string,
    setCode: PropTypes.func,
    setDescription: PropTypes.func,
    onClose: PropTypes.func,
}

const mapStateToProps = (state) => ({
    description: sGetEditDashboardDescription(state),
    code: sGetEditDashboardCode(state),
})

const mapDispatchToProps = {
    setDescription: acSetDashboardDescription,
    setCode: acSetDashboardCode,
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailsModal)
