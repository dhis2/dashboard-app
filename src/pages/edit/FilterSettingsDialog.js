import { DIMENSION_ID_PERIOD, DIMENSION_ID_ORGUNIT } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    Radio,
    Transfer,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import useDimensions from '../../modules/useDimensions.js'
import classes from './styles/FilterSettingsDialog.module.css'

const RadioOptions = ({
    filtersSelectable,
    updateFilterDimensionRestrictability,
}) => (
    <form>
        <div className={classes.radioButton}>
            <Radio
                dense
                checked={!filtersSelectable}
                label={i18n.t('Allow filtering by all dimensions')}
                name="radio-allow-filtering-on-all"
                onChange={(payload) => {
                    return updateFilterDimensionRestrictability(
                        payload.value === 'true'
                    )
                }}
                value={'false'}
            />
        </div>
        <div className={classes.radioButton}>
            <Radio
                dense
                checked={filtersSelectable}
                label={i18n.t('Only allow filtering by selected dimensions')}
                name="radio-restrict-filtering"
                onChange={(payload) => {
                    return updateFilterDimensionRestrictability(
                        payload.value === 'true'
                    )
                }}
                value={'true'}
            />
        </div>
    </form>
)

RadioOptions.propTypes = {
    filtersSelectable: PropTypes.bool,
    updateFilterDimensionRestrictability: PropTypes.func,
}

const FilterSettingsDialog = ({
    restrictFilters,
    initiallySelectedItems,
    onClose,
    onConfirm,
    open,
}) => {
    const [selected, setSelected] = useState(initiallySelectedItems)
    const [filtersSelectable, setFiltersSelectable] = useState(restrictFilters)
    const dimensions = useDimensions(open)

    const updateFilterDimensionRestrictability = (val) => {
        if (val) {
            const otherItems = selected.filter(
                (i) => i !== DIMENSION_ID_ORGUNIT && i !== DIMENSION_ID_PERIOD
            )
            updateSelectedFilters([
                DIMENSION_ID_PERIOD,
                DIMENSION_ID_ORGUNIT,
                ...otherItems,
            ])
        }
        setFiltersSelectable(val)
    }

    const updateSelectedFilters = (sItems) => {
        // ensure that orgUnit, period appear before other items
        const periodItem = [
            ...new Set(sItems.filter((i) => i === DIMENSION_ID_PERIOD)),
        ]
        const orgUnitItem = [
            ...new Set(sItems.filter((i) => i === DIMENSION_ID_ORGUNIT)),
        ]
        const otherItems = sItems.filter(
            (i) => i !== DIMENSION_ID_ORGUNIT && i !== DIMENSION_ID_PERIOD
        )
        return setSelected([...periodItem, ...orgUnitItem, ...otherItems])
    }

    const closeDialog = () => {
        setSelected(initiallySelectedItems)
        setFiltersSelectable(restrictFilters)
        onClose()
    }

    return (
        <>
            {open && (
                <Modal large position="top" onClose={closeDialog}>
                    <ModalTitle>
                        {i18n.t('Dashboard filter settings')}
                    </ModalTitle>
                    <ModalContent>
                        <div className={classes.descContainer}>
                            <span>
                                {i18n.t(`Dashboards can be filtered by dimensions to change
                                         the data shown. By default, all dimensions are available
                                         as filters. Alternatively, only selected dimensions can
                                         be made available on a dashboard.`)}
                            </span>
                        </div>
                        <RadioOptions
                            filtersSelectable={filtersSelectable}
                            updateFilterDimensionRestrictability={
                                updateFilterDimensionRestrictability
                            }
                        />
                        {filtersSelectable && (
                            <Transfer
                                filterable
                                height="400px"
                                leftHeader={
                                    <div className={classes.transferHeader}>
                                        <span>
                                            {i18n.t('Available Filters')}
                                        </span>
                                    </div>
                                }
                                maxSelections={Infinity}
                                onChange={(payload) => {
                                    return updateSelectedFilters(
                                        payload.selected
                                    )
                                }}
                                options={dimensions.map((d) => {
                                    return { label: d.name, value: d.id }
                                })}
                                optionsWidth="350px"
                                rightHeader={
                                    <div className={classes.transferHeader}>
                                        <span>
                                            {i18n.t('Selected Filters')}
                                        </span>
                                    </div>
                                }
                                selected={selected}
                                selectedWidth="350px"
                            />
                        )}
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip end>
                            <Button
                                onClick={closeDialog}
                                secondary
                                type="button"
                            >
                                {i18n.t('Cancel')}
                            </Button>
                            <Button
                                onClick={() => {
                                    if (!filtersSelectable) {
                                        setSelected([])
                                    }
                                    onConfirm(filtersSelectable, selected)
                                }}
                                primary
                                type="button"
                            >
                                {i18n.t('Confirm')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </>
    )
}

FilterSettingsDialog.propTypes = {
    initiallySelectedItems: PropTypes.array,
    open: PropTypes.bool,
    restrictFilters: PropTypes.bool,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
}

export default FilterSettingsDialog
