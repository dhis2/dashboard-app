import React from 'react';
import { t } from 'i18next';
import { Trans } from 'react-i18next';
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
            <Trans>Delete</Trans>
        </Button>,
        <Button onClick={onContinueEditing} style={style.button}>
            <Trans>Continue editing</Trans>
        </Button>,
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
