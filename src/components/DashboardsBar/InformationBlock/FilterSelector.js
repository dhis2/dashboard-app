import { DimensionsPanel } from '@dhis2/analytics'
import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Card, colors, IconFilter24 } from '@dhis2/ui'
import isEmpty from 'lodash/isEmpty.js'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import {
    acClearActiveModalDimension,
    acSetActiveModalDimension,
} from '../../../actions/activeModalDimension.js'
import useDimensions from '../../../modules/useDimensions.js'
import { sGetActiveModalDimension } from '../../../reducers/activeModalDimension.js'
import { sGetItemFiltersRoot } from '../../../reducers/itemFilters.js'
import DropdownButton from '../../DropdownButton/DropdownButton.js'
import FilterDialog from './FilterDialog.js'

const FilterSelector = (props) => {
    const [filterDialogIsOpen, setFilterDialogIsOpen] = useState(false)
    const dimensions = useDimensions(filterDialogIsOpen)
    const { isDisconnected: offline } = useDhis2ConnectionStatus()

    const toggleFilterDialogIsOpen = () =>
        setFilterDialogIsOpen(!filterDialogIsOpen)

    const onCloseDialog = () => {
        setFilterDialogIsOpen(false)

        props.clearActiveModalDimension()
    }

    const selectDimension = (id) => {
        props.setActiveModalDimension(
            dimensions.find((dimension) => dimension.id === id)
        )
    }

    const filterDimensions = () => {
        if (!props.restrictFilters) {
            return dimensions
        } else {
            return dimensions.filter((d) =>
                [...props.allowedFilters].includes(d.id)
            )
        }
    }

    const getFilterSelector = () => (
        <Card dataTest="dashboard-filter-popover">
            <DimensionsPanel
                style={{ width: '320px' }}
                dimensions={filterDimensions()}
                onDimensionClick={selectDimension}
                selectedIds={Object.keys(props.initiallySelectedItems)}
            />
        </Card>
    )

    return props.restrictFilters && !props.allowedFilters?.length ? null : (
        <>
            <DropdownButton
                secondary
                small
                open={filterDialogIsOpen}
                disabled={offline}
                onClick={toggleFilterDialogIsOpen}
                icon={<IconFilter24 color={colors.grey700} />}
                component={getFilterSelector()}
            >
                {i18n.t('Filter')}
            </DropdownButton>
            {!isEmpty(props.dimension) ? (
                <FilterDialog
                    dimension={props.dimension}
                    onClose={onCloseDialog}
                />
            ) : null}
        </>
    )
}

const mapStateToProps = (state) => ({
    dimension: sGetActiveModalDimension(state),
    initiallySelectedItems: sGetItemFiltersRoot(state),
})

FilterSelector.propTypes = {
    allowedFilters: PropTypes.array,
    clearActiveModalDimension: PropTypes.func,
    dimension: PropTypes.object,
    initiallySelectedItems: PropTypes.object,
    restrictFilters: PropTypes.bool,
    setActiveModalDimension: PropTypes.func,
}

export default connect(mapStateToProps, {
    clearActiveModalDimension: acClearActiveModalDimension,
    setActiveModalDimension: acSetActiveModalDimension,
})(FilterSelector)
