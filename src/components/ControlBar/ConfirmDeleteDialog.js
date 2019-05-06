import React from 'react';
import i18n from '@dhis2/d2-i18n';
import Dialog from 'material-ui/Dialog';
import { Button } from '@dhis2/ui-core';

export const ConfirmDeleteDialog = ({
    dashboardName,
    onDeleteConfirmed,
    onContinueEditing,
    open,
}) => {
    const actions = [
        <span style={{ marginRight: '15px' }}>
            <Button primary onClick={onDeleteConfirmed}>
                {i18n.t('Delete')}
            </Button>
        </span>,
        <Button secondary onClick={onContinueEditing}>
            {i18n.t('Continue editing')}
        </Button>,
    ];

    return (
        <Dialog
            title={i18n.t('Confirm delete dashboard')}
            actions={actions}
            modal={true}
            open={open}
        >
            {i18n.t(
                'Are you sure you want to delete dashboard "{{ dashboardName }}"?',
                { dashboardName }
            )}
        </Dialog>
    );
};

export default ConfirmDeleteDialog;
