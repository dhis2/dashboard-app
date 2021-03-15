import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import isEmpty from 'lodash/isEmpty'

import i18n from '@dhis2/d2-i18n'
import { DimensionsPanel, apiFetchDimensions } from '@dhis2/analytics'
import { acSetDimensions } from '../../actions/dimensions'
import { sGetDimensions } from '../../reducers/dimensions'
import { useDataEngine } from '@dhis2/app-runtime'
import { useUserSettings } from '../UserSettingsProvider'
import getFilteredDimensions from '../../modules/getFilteredDimensions'

import { Button, Popover } from '@dhis2/ui'
import FilterDialog from './FilterDialog'

import { sGetActiveModalDimension } from '../../reducers/activeModalDimension'
import { sGetItemFiltersRoot } from '../../reducers/itemFilters'
import {
    acClearActiveModalDimension,
    acSetActiveModalDimension,
} from '../../actions/activeModalDimension'

import classes from './styles/FilterSelector.module.css'

const FilterSelector = props => {
    const [showPopover, setShowPopover] = useState(false)
    const dataEngine = useDataEngine()
    const { userSettings } = useUserSettings()

    useEffect(() => {
        const fetchDimensions = async () => {
            try {
                const dimensions = await apiFetchDimensions(
                    dataEngine,
                    userSettings.keyAnalysisDisplayProperty
                )

                props.setDimensions(getFilteredDimensions(dimensions))
            } catch (e) {
                console.error(e)
            }
        }

        if (
            userSettings.keyAnalysisDisplayProperty &&
            showPopover === true &&
            !props.dimensions.length
        ) {
            fetchDimensions()
        }
    }, [userSettings, showPopover, props.dimensions])

    const ref = useRef(null)

    const onCloseDialog = () => {
        setShowPopover(false)

        props.clearActiveModalDimension()
    }

    const selectDimension = id => {
        props.setActiveModalDimension(
            props.dimensions.find(dimension => dimension.id === id)
        )
    }

    const filterDimensions = () => {
        if (!props.restrictFilters) {
            return props.dimensions
        } else {
            return props.dimensions.filter(d =>
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
    dimensions: sGetDimensions(state),
    initiallySelectedItems: sGetItemFiltersRoot(state),
})

FilterSelector.propTypes = {
    allowedFilters: PropTypes.array,
    clearActiveModalDimension: PropTypes.func,
    dimension: PropTypes.object,
    dimensions: PropTypes.array,
    initiallySelectedItems: PropTypes.object,
    restrictFilters: PropTypes.bool,
    setActiveModalDimension: PropTypes.func,
    setDimensions: PropTypes.func,
}

export default connect(mapStateToProps, {
    clearActiveModalDimension: acClearActiveModalDimension,
    setActiveModalDimension: acSetActiveModalDimension,
    setDimensions: acSetDimensions,
})(FilterSelector)
