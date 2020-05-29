import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    Button,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
} from '@dhis2/ui-core';

import i18n from '@dhis2/d2-i18n';

import {
    PeriodDimension,
    DynamicDimension,
    OrgUnitDimension,
    DIMENSION_ID_PERIOD,
    DIMENSION_ID_ORGUNIT,
} from '@dhis2/analytics';

class FilterDialog extends Component {
    onConfirm = id => () => this.props.onConfirm(id);

    renderDialogContent() {
        const { displayNameProperty, dimension, selectedItems } = this.props;
        const dialogId = dimension.id;

        const commonProps = {
            d2: this.context.d2,
            onSelect: this.props.onSelect,
            onDeselect: this.props.onDeselect,
            onReorder: this.props.onReorder,
        };

        switch (dialogId) {
            case DIMENSION_ID_PERIOD: {
                return (
                    <PeriodDimension
                        selectedPeriods={selectedItems}
                        onSelect={commonProps.onSelect}
                    />
                );
            }
            case DIMENSION_ID_ORGUNIT:
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
                        {...commonProps}
                    />
                );
        }
    }

    render() {
        const { dimension, onClose } = this.props;
        const dialogId = dimension.id;

        return (
            <>
                {dialogId && (
                    <Modal onClose={onClose} position="top" large>
                        <ModalTitle>{dimension.name}</ModalTitle>
                        <ModalContent>
                            {this.renderDialogContent()}
                        </ModalContent>
                        <ModalActions>
                            <ButtonStrip>
                                <Button secondary onClick={onClose}>
                                    {i18n.t('Cancel')}
                                </Button>
                                <Button
                                    primary
                                    onClick={this.onConfirm(dialogId)}
                                >
                                    {i18n.t('Confirm')}
                                </Button>
                            </ButtonStrip>
                        </ModalActions>
                    </Modal>
                )}
            </>
        );
    }
}

FilterDialog.propTypes = {
    dimension: PropTypes.object,
    displayNameProperty: PropTypes.string,
    selectedItems: PropTypes.array,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
    onDeselect: PropTypes.func,
    onReorder: PropTypes.func,
    onSelect: PropTypes.func,
};

FilterDialog.contextTypes = {
    d2: PropTypes.object,
};

export default FilterDialog;
