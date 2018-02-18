import React from 'react';
import { t } from 'i18next';
import Dialog from 'material-ui/Dialog';
import FlatButton from '../widgets/FlatButton';
import PrimaryButton from '../widgets/PrimaryButton';

const ConfirmDeleteDialog = ({
    dashboardName,
    onDeleteConfirmed,
    onContinueEditing,
    open,
}) => {
    const actions = [
        <FlatButton onClick={onDeleteConfirmed}>{t('Delete')}</FlatButton>,
        <PrimaryButton onClick={onContinueEditing}>
            {t('Continue editing')}
        </PrimaryButton>,
    ];

    return (
        <Dialog
            title={t('Confirm delete dashboard')}
            actions={actions}
            modal={true}
            open={open}
        >
            {t('Are you sure you want to delete dashboard {{ name }}', {
                name: dashboardName,
            })}
        </Dialog>
    );
};

export default ConfirmDeleteDialog;
