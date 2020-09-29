import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    Modal,
    ModalContent,
    ModalActions,
    ButtonStrip,
    ModalTitle,
} from '@dhis2/ui'

import classes from './styles/ConfirmDeleteDialog.module.css'

export const ConfirmDeleteDialog = ({
    dashboardName,
    onDeleteConfirmed,
    onContinueEditing,
    open,
}) => {
    const actions = [
        <Button key="cancel" secondary onClick={onContinueEditing}>
            {i18n.t('Cancel')}
        </Button>,
        <Button
            key="delete"
            destructive
            onClick={onDeleteConfirmed}
            dataTest="dhis2-dashboard-confirm-delete-dashboard"
        >
            {i18n.t('Delete')}
        </Button>,
    ]

    return (
        open && (
            <Modal onClose={onContinueEditing} small position="middle">
                <ModalTitle>{i18n.t('Delete dashboard')}</ModalTitle>
                <ModalContent>
                    <span className={classes.content}>
                        {i18n.t(
                            'Deleting dashboard "{{ dashboardName }}" will remove it for all users. This action cannot be undone. Are you sure you want to permanently delete this dashboard?',
                            { dashboardName }
                        )}
                    </span>
                </ModalContent>
                <ModalActions>
                    <ButtonStrip>{actions}</ButtonStrip>
                </ModalActions>
            </Modal>
        )
    )
}

ConfirmDeleteDialog.propTypes = {
    dashboardName: PropTypes.string,
    open: PropTypes.bool,
    onContinueEditing: PropTypes.func,
    onDeleteConfirmed: PropTypes.func,
}

export default ConfirmDeleteDialog
