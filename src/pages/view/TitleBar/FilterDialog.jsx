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
    useCachedDataQuery,
} from '@dhis2/analytics'
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
} from '../../../actions/itemFilters.js'
import { useSystemSettings } from '../../../components/SystemSettingsProvider.jsx'
import { useUserSettings } from '../../../components/UserSettingsProvider.jsx'
import { sGetItemFiltersRoot } from '../../../reducers/itemFilters.js'

const FilterDialog = ({
    dimension,
    initiallySelectedItems,
    addItemFilter,
    removeItemFilter,
    onClose,
}) => {
    const [filters, setFilters] = useState(initiallySelectedItems)
    const { userSettings } = useUserSettings()
    const { systemSettings } = useSystemSettings()
    const { rootOrgUnits } = useCachedDataQuery()

    const onSelectItems = ({ dimensionId, items }) => {
        setFilters({ [dimensionId]: items })
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

    const getExcludedPeriodTypes = (systemSettings = {}) => {
        const types = []
        if (systemSettings['hideDailyPeriods']) {
            types.push(DAILY)
        }
        if (systemSettings['hideWeeklyPeriods']) {
            types.push(WEEKLY, WEEKLYWED, WEEKLYTHU, WEEKLYSAT, WEEKLYSUN)
        }
        if (systemSettings['hideBiWeeklyPeriods']) {
            types.push(BIWEEKLY)
        }
        if (systemSettings['hideMonthlyPeriods']) {
            types.push(MONTHLY)
        }
        if (systemSettings['hideBiMonthlyPeriods']) {
            types.push(BIMONTHLY)
        }
        return types
    }

    const renderDialogContent = () => {
        const selectedItems = filters[dimension.id] || []

        switch (dimension.id) {
            case DIMENSION_ID_PERIOD: {
                return (
                    <PeriodDimension
                        selectedPeriods={selectedItems}
                        onSelect={onSelectItems}
                        excludedPeriodTypes={getExcludedPeriodTypes(
                            systemSettings
                        )}
                    />
                )
            }
            case DIMENSION_ID_ORGUNIT:
                return (
                    <OrgUnitDimension
                        roots={rootOrgUnits.map(
                            (rootOrgUnit) => rootOrgUnit.id
                        )}
                        selected={selectedItems}
                        onSelect={onSelectItems}
                        displayNameProp={userSettings.displayProperty}
                    />
                )
            default:
                return (
                    <DynamicDimension
                        selectedItems={selectedItems}
                        dimensionId={dimension.id}
                        onSelect={onSelectItems}
                        dimensionTitle={dimension.name}
                        displayNameProp={userSettings.displayProperty}
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

const mapStateToProps = (state) => ({
    initiallySelectedItems: sGetItemFiltersRoot(state),
})

export default connect(mapStateToProps, {
    addItemFilter: acAddItemFilter,
    removeItemFilter: acRemoveItemFilter,
})(FilterDialog)
