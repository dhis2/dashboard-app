import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import Dialog from 'material-ui/Dialog';
import FlatButton from '../widgets/FlatButton';
import PrimaryButton from '../widgets/PrimaryButton';

const ConfirmDeleteDialog = (
    { dashboardName, onDeleteConfirmed, onContinueEditing, open },
    context
) => {
    const actions = [
        <FlatButton onClick={onDeleteConfirmed}>
            {context.i18n.t('Delete')}
        </FlatButton>,
        <PrimaryButton onClick={onContinueEditing}>
            {context.i18n.t('Continue editing')}
        </PrimaryButton>,
    ];

    return (
        <Dialog
            title={context.i18n.t('Confirm delete dashboard')}
            actions={actions}
            modal={true}
            open={open}
        >
            <Trans>
                Are you sure you want to delete dashboard{' '}
                <strong>{{ dashboardName }}</strong>?
            </Trans>
        </Dialog>
    );
};

ConfirmDeleteDialog.contextTypes = {
    i18n: PropTypes.object,
};

export default ConfirmDeleteDialog;
