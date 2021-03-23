import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import isEmpty from 'lodash/isEmpty'
import i18n from '@dhis2/d2-i18n'
import { DimensionsPanel } from '@dhis2/analytics'
import { Button, Popover } from '@dhis2/ui'
import FilterDialog from './FilterDialog'

import { sGetActiveModalDimension } from '../../../reducers/activeModalDimension'
import { sGetItemFiltersRoot } from '../../../reducers/itemFilters'
import {
    acClearActiveModalDimension,
    acSetActiveModalDimension,
} from '../../../actions/activeModalDimension'
import useDimensions from '../../../modules/useDimensions'

import classes from './styles/FilterSelector.module.css'

const FilterSelector = props => {
    const [showPopover, setShowPopover] = useState(false)
    const dimensions = useDimensions(showPopover)

    const ref = useRef(null)

    const onCloseDialog = () => {
        setShowPopover(false)

        props.clearActiveModalDimension()
    }

    const selectDimension = id => {
        props.setActiveModalDimension(
            dimensions.find(dimension => dimension.id === id)
        )
    }

    const filterDimensions = () => {
        if (!props.restrictFilters) {
            return dimensions
        } else {
            return dimensions.filter(d =>
                [...props.allowedFilters].includes(d.id)
            )
        }
    }

    return props.restrictFilters && !props.allowedFilters ? null : (
        <>
            <span className={classes.buttonContainer} ref={ref}>
                <Button onClick={() => setShowPopover(true)}>
                    {i18n.t('Add filter')}
                    <ArrowDropDownIcon />
                </Button>
            </span>
            {showPopover && (
                <Popover
                    onClickOutside={onCloseDialog}
                    reference={ref}
                    arrow={true}
                    placement="bottom-start"
                    dataTest="dashboard-filter-popover"
                >
                    <div className={classes.popover}>
                        <DimensionsPanel
                            style={{ width: '320px' }}
                            dimensions={filterDimensions()}
                            onDimensionClick={selectDimension}
                            selectedIds={Object.keys(
                                props.initiallySelectedItems
                            )}
                        />
                    </div>
                </Popover>
            )}
            {!isEmpty(props.dimension) ? (
                <FilterDialog
                    dimension={props.dimension}
                    onClose={onCloseDialog}
                />
            ) : null}
        </>
    )
}

const mapStateToProps = state => ({
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
