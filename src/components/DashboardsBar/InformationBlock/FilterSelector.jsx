import { DimensionsPanel } from '@dhis2/analytics'
import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Card, IconFilter24 } from '@dhis2/ui'
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
import { sGetSelectedIsEmbedded } from '../../../reducers/selected.js'
import DropdownButton from '../../DropdownButton/DropdownButton.jsx'
import FilterDialog from './FilterDialog.jsx'

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
                disabled={offline || props.embedded}
                disabledWhenOffline={offline}
                onClick={toggleFilterDialogIsOpen}
                icon={<IconFilter24 />}
                component={getFilterSelector()}
                content={
                    props.embedded
                        ? i18n.t('Not available for embedded dashboards')
                        : undefined
                }
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
    embedded: sGetSelectedIsEmbedded(state),
    dimension: sGetActiveModalDimension(state),
    initiallySelectedItems: sGetItemFiltersRoot(state),
})

FilterSelector.propTypes = {
    allowedFilters: PropTypes.array,
    clearActiveModalDimension: PropTypes.func,
    dimension: PropTypes.object,
    embedded: PropTypes.bool,
    initiallySelectedItems: PropTypes.object,
    restrictFilters: PropTypes.bool,
    setActiveModalDimension: PropTypes.func,
}

export default connect(mapStateToProps, {
    clearActiveModalDimension: acClearActiveModalDimension,
    setActiveModalDimension: acSetActiveModalDimension,
})(FilterSelector)
