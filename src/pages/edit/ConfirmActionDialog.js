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

import classes from './styles/ConfirmActionDialog.module.css'

export const ACTION_DELETE = 'delete'
export const ACTION_DISCARD = 'discard'

const ConfirmActionDialog = ({
    action,
    dashboardName,
    onConfirm,
    onCancel,
    open,
}) => {
    const texts = {
        [ACTION_DELETE]: {
            title: i18n.t('Delete dashboard'),
            message: i18n.t(
                'Deleting dashboard "{{ dashboardName }}" will remove it for all users. This action cannot be undone. Are you sure you want to permanently delete this dashboard?',
                { dashboardName }
            ),
            cancel: i18n.t('Cancel'),
            confirm: i18n.t('Delete'),
        },
        [ACTION_DISCARD]: {
            title: i18n.t('Discard changes'),
            message: i18n.t(
                'This dashboard has unsaved changes. Are you sure you want to leave and discard these unsaved changes?'
            ),
            cancel: i18n.t('No, stay here'),
            confirm: i18n.t('Yes, discard changes'),
        },
    }

    const actions = [
        <Button key="cancel" secondary onClick={onCancel}>
            {texts[action].cancel}
        </Button>,
        <Button key="confirm" destructive onClick={onConfirm}>
            {texts[action].confirm}
        </Button>,
    ]

    return (
        open && (
            <Modal onClose={onCancel} small position="middle">
                <ModalTitle>{texts[action].title}</ModalTitle>
                <ModalContent>
                    <span className={classes.content}>
                        {texts[action].message}
                    </span>
                </ModalContent>
                <ModalActions>
                    <ButtonStrip>{actions}</ButtonStrip>
                </ModalActions>
            </Modal>
        )
    )
}

ConfirmActionDialog.propTypes = {
    action: PropTypes.string,
    dashboardName: PropTypes.string,
    open: PropTypes.bool,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
}

export default ConfirmActionDialog
