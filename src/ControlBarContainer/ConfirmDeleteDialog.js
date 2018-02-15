import React from 'react';
import Dialog from 'material-ui/Dialog';
import Button from '../widgets/Button';
import PrimaryButton from '../widgets/PrimaryButton';

const ConfirmDeleteDialog = ({
    dashboardName,
    onDeleteConfirmed,
    onContinueEditing,
    open,
}) => {
    const actions = [
        <Button onClick={onDeleteConfirmed}>Delete</Button>,
        <PrimaryButton onClick={onContinueEditing}>
            Continue editing
        </PrimaryButton>,
    ];

    return (
        <Dialog
            title="Confirm delete dashboard"
            actions={actions}
            modal={true}
            open={open}
        >
            {`Are you sure you want to delete dashboard "${dashboardName}"?`}
        </Dialog>
    );
};

export default ConfirmDeleteDialog;
