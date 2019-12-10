import React from 'react';
import PropTypes from 'prop-types';
import i18n from '@dhis2/d2-i18n';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { Button } from '@dhis2/ui-core';

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
        <Button key="delete" destructive onClick={onDeleteConfirmed}>
            {i18n.t('Delete')}
        </Button>,
    ];

    return (
        <Dialog open={open} onClose={onContinueEditing}>
            <DialogTitle style={{ fontSize: '1.25rem', fontWeight: '450' }}>
                {i18n.t('Delete dashboard')}
            </DialogTitle>
            <DialogContent>
                <DialogContentText style={{ fontSize: '0.875rem' }}>
                    {i18n.t(
                        'Deleting dashboard "{{ dashboardName }}" will remove it for all users. This action cannot be undone. Are you sure you want to permanently delete this dashboard?',
                        { dashboardName }
                    )}
                </DialogContentText>
            </DialogContent>
            <DialogActions>{actions}</DialogActions>
        </Dialog>
    );
};

ConfirmDeleteDialog.propTypes = {
    dashboardName: PropTypes.string,
    open: PropTypes.bool,
    onContinueEditing: PropTypes.func,
    onDeleteConfirmed: PropTypes.func,
};

export default ConfirmDeleteDialog;
