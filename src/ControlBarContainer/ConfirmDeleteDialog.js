import React from 'react';
import Dialog from 'material-ui/Dialog';
import Button from 'd2-ui/lib/button/Button';
import { colors } from '../colors';

const style = {
    button: {
        color: colors.royalBlue,
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '14px',
        fontWeight: 500,
        textTransform: 'uppercase',
        padding: '5px',
        height: '36px',
        cursor: 'pointer',
    },
};

const ConfirmDeleteDialog = ({
    dashboardName,
    onDeleteConfirmed,
    onContinueEditing,
    open,
}) => {
    const actions = [
        <Button onClick={onDeleteConfirmed} style={style.button}>
            Delete
        </Button>,
        <Button onClick={onContinueEditing} style={style.button}>
            Continue editing
        </Button>,
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
