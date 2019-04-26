import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button } from '@dhis2/ui-core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';

import i18n from '@dhis2/d2-i18n';

import {
    PeriodDimension,
    DynamicDimension,
    OrgUnitDimension,
    FIXED_DIMENSIONS,
} from '@dhis2/d2-ui-analytics';

const peId = FIXED_DIMENSIONS.pe.id;
const ouId = FIXED_DIMENSIONS.ou.id;

class FilterDialog extends Component {
    onConfirm = id => () => this.props.onConfirm(id);

    dialogContent() {
        const { displayNameProperty, dimension, selectedItems } = this.props;
        const dialogId = dimension.id;

        const commonProps = {
            d2: this.context.d2,
            onSelect: this.props.onSelect,
            onDeselect: this.props.onDeselect,
            onReorder: this.props.onReorder,
        };

        switch (dialogId) {
            case peId: {
                return (
                    <PeriodDimension
                        selectedPeriods={selectedItems}
                        {...commonProps}
                    />
                );
            }
            case ouId:
                return (
                    <OrgUnitDimension
                        displayNameProperty={displayNameProperty}
                        ouItems={selectedItems}
                        {...commonProps}
                    />
                );
            default:
                return (
                    <DynamicDimension
                        selectedItems={selectedItems}
                        dialogId={dialogId}
                        dialogTitle={dimension.name}
                        {...commonProps}
                    />
                );
        }
    }

    render() {
        const { dimension, onClose } = this.props;
        const dialogId = dimension.id;

        return (
            <Dialog
                open={!!dialogId}
                maxWidth="lg"
                disableEnforceFocus
                onClose={onClose}
            >
                {dialogId && this.dialogContent()}
                <DialogActions>
                    <Button kind="secondary" onClick={onClose}>
                        {i18n.t('Cancel')}
                    </Button>
                    <Button kind="primary" onClick={this.onConfirm(dialogId)}>
                        {i18n.t('Confirm')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

FilterDialog.propTypes = {
    displayNameProperty: PropTypes.string,
    dimension: PropTypes.object,
    selectedItems: PropTypes.array,
    onSelect: PropTypes.func,
    onDeselect: PropTypes.func,
    onReorder: PropTypes.func,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
};

FilterDialog.contextTypes = {
    d2: PropTypes.object,
};

export default FilterDialog;
