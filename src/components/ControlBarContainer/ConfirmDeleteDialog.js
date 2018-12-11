import React from 'react';
import i18n from 'd2-i18n';
import Dialog from 'material-ui/Dialog';

import FlatButton from '../../widgets/FlatButton';
import PrimaryButton from '../../widgets/PrimaryButton';

export const ConfirmDeleteDialog = ({
    dashboardName,
    onDeleteConfirmed,
    onContinueEditing,
    open,
}) => {
    const actions = [
        <FlatButton onClick={onDeleteConfirmed}>{i18n.t('Delete')}</FlatButton>,
        <PrimaryButton onClick={onContinueEditing}>
            {i18n.t('Continue editing')}
        </PrimaryButton>,
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
