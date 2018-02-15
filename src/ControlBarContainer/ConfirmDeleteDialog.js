import React from 'react';
import { t } from 'i18next';
import { Trans } from 'react-i18next';
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
        <FlatButton onClick={onDeleteConfirmed}><Trans>Delete</Trans></FlatButton>,
        <PrimaryButton onClick={onContinueEditing}>
            <Trans>Continue editing</Trans>
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
