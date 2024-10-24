import i18n from '@dhis2/d2-i18n'
import { colors, IconSearch16, IconSearch24 } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import {
    acSetDashboardsFilter,
    acClearDashboardsFilter,
} from '../../actions/dashboardsFilter.js'
import { isSmallScreen } from '../../modules/smallScreen.js'
import { sGetDashboardsFilter } from '../../reducers/dashboardsFilter.js'
import { useWindowDimensions } from '../WindowDimensionsProvider.jsx'
import ClearButton from './ClearButton.jsx'
import classes from './styles/Filter.module.css'

export const KEYCODE_ENTER = 13
export const KEYCODE_ESCAPE = 27

const Filter = ({
    clearDashboardsFilter,
    expanded,
    filterText,
    setDashboardsFilter,
    onKeypressEnter,
    onSearchClicked,
}) => {
    const [focusedClassName, setFocusedClassName] = useState('')
    const [inputFocused, setInputFocus] = useState(false)
    const { width } = useWindowDimensions()

    const setFilterValue = (event) => {
        event.preventDefault()
        setDashboardsFilter(event.target.value)
    }

    const onKeyUp = (event) => {
        switch (event.keyCode) {
            case KEYCODE_ENTER:
                onKeypressEnter()
                clearDashboardsFilter()
                break
            case KEYCODE_ESCAPE:
                clearDashboardsFilter()
                break
            default:
                break
        }
    }

    const onFocus = (event) => {
        event.preventDefault()
        setFocusedClassName(classes.focused)
    }

    const onBlur = (event) => {
        event.preventDefault()
        setFocusedClassName('')
    }

    const onFocusInput = (input) => {
        if (input && inputFocused && isSmallScreen(width)) {
            return input.focus()
        }
    }

    const activateSearchInput = () => {
        onSearchClicked()
        setInputFocus(true)
    }

    return (
        <span
            className={cx(
                classes.container,
                expanded ? classes.expanded : classes.collapsed
            )}
        >
            <button
                className={classes.searchButton}
                onClick={activateSearchInput}
            >
                <IconSearch24 color={colors.grey800} />
            </button>
            <div
                className={cx(classes.searchArea, `${focusedClassName}`)}
                onFocus={onFocus}
                onBlur={onBlur}
            >
                <div className={classes.searchIconContainer}>
                    <IconSearch16 color={colors.grey800} />
                </div>
                <input
                    className={classes.input}
                    type="text"
                    placeholder={i18n.t('Search for a dashboard')}
                    onChange={setFilterValue}
                    onKeyUp={onKeyUp}
                    value={filterText}
                    data-test="search-dashboard-input"
                    ref={onFocusInput}
                />
                {filterText && (
                    <div className={classes.clearButtonContainer}>
                        <ClearButton onClear={clearDashboardsFilter} />
                    </div>
                )}
            </div>
        </span>
    )
}

Filter.propTypes = {
    clearDashboardsFilter: PropTypes.func,
    expanded: PropTypes.bool,
    filterText: PropTypes.string,
    setDashboardsFilter: PropTypes.func,
    onKeypressEnter: PropTypes.func,
    onSearchClicked: PropTypes.func,
}

const mapStateToProps = (state) => ({
    filterText: sGetDashboardsFilter(state),
})

const mapDispatchToProps = {
    setDashboardsFilter: acSetDashboardsFilter,
    clearDashboardsFilter: acClearDashboardsFilter,
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter)
