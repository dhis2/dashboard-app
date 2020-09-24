import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
} from '@dhis2/ui'
import {
    PeriodDimension,
    DynamicDimension,
    OrgUnitDimension,
    DIMENSION_ID_PERIOD,
    DIMENSION_ID_ORGUNIT,
} from '@dhis2/analytics'

import { acAddItemFilter, acRemoveItemFilter } from '../../actions/itemFilters'
import { sGetItemFiltersRoot } from '../../reducers/itemFilters'

const FilterDialog = (
    {
        displayNameProperty,
        dimension,
        initiallySelectedItems,
        addItemFilter,
        removeItemFilter,
        onClose,
    },
    context
) => {
    const [filters, setFilters] = useState(initiallySelectedItems)

    const onSelectItems = ({ dimensionId, items }) => {
        setFilters({ [dimensionId]: items })
    }

    const onDeselectItems = ({ dimensionId, itemIdsToRemove }) => {
        const oldList = filters[dimensionId] || []
        const newList = oldList.filter(
            item => !itemIdsToRemove.includes(item.id)
        )

        setFilters({ ...filters, [dimensionId]: newList })
    }

    const onReorderItems = ({ dimensionId, itemIds }) => {
        const oldList = filters[dimensionId] || []
        const reorderedList = itemIds.map(id =>
            oldList.find(item => item.id === id)
        )

        setFilters({ ...filters, [dimensionId]: reorderedList })
    }

    const saveFilter = () => {
        const id = dimension.id
        const filterItems = filters[id]

        if (filterItems && filterItems.length) {
            addItemFilter({
                id,
                value: [...filterItems],
            })
        } else {
            removeItemFilter(id)
        }

        onClose(id)
    }

    const renderDialogContent = () => {
        const commonProps = {
            d2: context.d2,
            onSelect: onSelectItems,
            onDeselect: onDeselectItems,
            onReorder: onReorderItems,
        }

        const selectedItems = filters[dimension.id] || []

        switch (dimension.id) {
            case DIMENSION_ID_PERIOD: {
                return (
                    <PeriodDimension
                        selectedPeriods={selectedItems}
                        onSelect={commonProps.onSelect}
                    />
                )
            }
            case DIMENSION_ID_ORGUNIT:
                return (
                    <OrgUnitDimension
                        displayNameProperty={displayNameProperty}
                        ouItems={selectedItems}
                        {...commonProps}
                    />
                )
            default:
                return (
                    <DynamicDimension
                        selectedItems={selectedItems}
                        dimensionId={dimension.id}
                        onSelect={commonProps.onSelect}
                        context={commonProps.d2}
                    />
                )
        }
    }

    return (
        <>
            {dimension.id && (
                <Modal onClose={onClose} position="top" large>
                    <ModalTitle>{dimension.name}</ModalTitle>
                    <ModalContent>{renderDialogContent()}</ModalContent>
                    <ModalActions>
                        <ButtonStrip>
                            <Button secondary onClick={onClose}>
                                {i18n.t('Cancel')}
                            </Button>
                            <Button primary onClick={saveFilter}>
                                {i18n.t('Confirm')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </>
    )
}

FilterDialog.propTypes = {
    addItemFilter: PropTypes.func,
    dimension: PropTypes.object,
    displayNameProperty: PropTypes.string,
    initiallySelectedItems: PropTypes.object,
    removeItemFilter: PropTypes.func,
    onClose: PropTypes.func,
}

FilterDialog.contextTypes = {
    d2: PropTypes.object,
}

const mapStateToProps = state => ({
    initiallySelectedItems: sGetItemFiltersRoot(state),
})

export default connect(mapStateToProps, {
    addItemFilter: acAddItemFilter,
    removeItemFilter: acRemoveItemFilter,
})(FilterDialog)
