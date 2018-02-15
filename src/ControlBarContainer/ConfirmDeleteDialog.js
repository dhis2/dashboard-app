import React from 'react';
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
        <FlatButton onClick={onDeleteConfirmed}>Delete</FlatButton>,
        <PrimaryButton onClick={onContinueEditing} disabled={true}>
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
