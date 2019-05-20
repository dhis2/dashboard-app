import React from 'react';
import PropTypes from 'prop-types';
import i18n from '@dhis2/d2-i18n';
import { Button, Modal } from '@dhis2/ui-core';

export const ConfirmDeleteDialog = ({
    dashboardName,
    onDeleteConfirmed,
    onContinueEditing,
    open,
}) => (
    <Modal open={open} onClose={onContinueEditing}>
        <Modal.Title>{i18n.t('Delete dashboard')}</Modal.Title>
        <Modal.Content>
            <span style={{ fontSize: '14px', lineHeight: '1.4' }}>
                {i18n.t(
                    'Deleting dashboard "{{ dashboardName }}" will remove it for all users. This action cannot be undone. Are you sure you want to permanently delete this dashboard?',
                    { dashboardName }
                )}
            </span>
        </Modal.Content>
        <Modal.Actions>
            <Button key="cancel" secondary onClick={onContinueEditing}>
                {i18n.t('Cancel')}
            </Button>
            <span style={{ marginLeft: '8px' }}>
                <Button key="delete" destructive onClick={onDeleteConfirmed}>
                    {i18n.t('Delete')}
                </Button>
            </span>
        </Modal.Actions>
    </Modal>
);

ConfirmDeleteDialog.propTypes = {
    dashboardName: PropTypes.string,
    onDeleteConfirmed: PropTypes.func,
    onContinueEditing: PropTypes.func,
    open: PropTypes.bool,
};

export default ConfirmDeleteDialog;
