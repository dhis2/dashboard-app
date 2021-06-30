import {
    PeriodDimension,
    DynamicDimension,
    OrgUnitDimension,
    DIMENSION_ID_PERIOD,
    DIMENSION_ID_ORGUNIT,
    DAILY,
    WEEKLY,
    WEEKLYWED,
    WEEKLYTHU,
    WEEKLYSAT,
    WEEKLYSUN,
    BIWEEKLY,
    MONTHLY,
    BIMONTHLY,
} from '@dhis2/analytics'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import {
    acAddItemFilter,
    acRemoveItemFilter,
} from '../../../actions/itemFilters'
import { useSystemSettings } from '../../../components/SystemSettingsProvider'
import { useUserSettings } from '../../../components/UserSettingsProvider'
import { sGetItemFiltersRoot } from '../../../reducers/itemFilters'

const FilterDialog = ({
    dimension,
    initiallySelectedItems,
    addItemFilter,
    removeItemFilter,
    onClose,
}) => {
    const [filters, setFilters] = useState(initiallySelectedItems)
    const { d2 } = useD2()
    const { userSettings } = useUserSettings()
    const { settings: systemSettings } = useSystemSettings()

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

    const getExcludedPeriodTypes = (settings = {}) => {
        const types = []
        if (settings['hideDailyPeriods']) {
            types.push(DAILY)
        }
        if (settings['hideWeeklyPeriods']) {
            types.push(WEEKLY, WEEKLYWED, WEEKLYTHU, WEEKLYSAT, WEEKLYSUN)
        }
        if (settings['hideBiWeeklyPeriods']) {
            types.push(BIWEEKLY)
        }
        if (settings['hideMonthlyPeriods']) {
            types.push(MONTHLY)
        }
        if (settings['hideBiMonthlyPeriods']) {
            types.push(BIMONTHLY)
        }
        return types
    }

    const renderDialogContent = () => {
        const commonProps = {
            d2,
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
                        excludedPeriodTypes={getExcludedPeriodTypes(
                            systemSettings
                        )}
                    />
                )
            }
            case DIMENSION_ID_ORGUNIT:
                return (
                    <OrgUnitDimension
                        displayNameProperty={
                            userSettings.keyAnalysisDisplayProperty
                        }
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
                        dimensionTitle={dimension.name}
                        displayNameProp={
                            userSettings.keyAnalysisDisplayProperty
                        }
                    />
                )
        }
    }

    return (
        <>
            {dimension.id && (
                <Modal
                    dataTest="dimension-modal"
                    onClose={onClose}
                    position="top"
                    large
                >
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
    initiallySelectedItems: PropTypes.object,
    removeItemFilter: PropTypes.func,
    onClose: PropTypes.func,
}

const mapStateToProps = state => ({
    initiallySelectedItems: sGetItemFiltersRoot(state),
})

export default connect(mapStateToProps, {
    addItemFilter: acAddItemFilter,
    removeItemFilter: acRemoveItemFilter,
})(FilterDialog)
