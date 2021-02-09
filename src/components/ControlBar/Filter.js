import React, { useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import SearchIcon from '../../icons/Search'
import ClearButton from './ClearButton'

import { useWindowDimensions } from '../WindowDimensionsProvider'
import {
    acSetDashboardsFilter,
    acClearDashboardsFilter,
} from '../../actions/dashboardsFilter'
import { sGetDashboardsFilter } from '../../reducers/dashboardsFilter'
import { isSmallScreen } from '../../modules/smallScreen'

import classes from './styles/Filter.module.css'

export const KEYCODE_ENTER = 13
export const KEYCODE_ESCAPE = 27

export const FilterUnconnected = ({
    clearDashboardsFilter,
    filterText,
    isMaxHeight,
    setDashboardsFilter,
    onKeypressEnter,
    onToggleMaxHeight,
}) => {
    const [focusedClassName, setFocusedClassName] = useState('')
    const [inputFocused, setInputFocus] = useState(false)
    const { width } = useWindowDimensions()

    const setFilterValue = event => {
        event.preventDefault()
        setDashboardsFilter(event.target.value)
    }

    const onKeyUp = event => {
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

    const onFocus = event => {
        event.preventDefault()
        setFocusedClassName(classes.focused)
    }

    const onBlur = event => {
        event.preventDefault()
        setFocusedClassName('')
    }

    const onFocusInput = input => {
        if (input && inputFocused && isSmallScreen(width)) {
            return input.focus()
        }
    }

    const toggleMaxHeight = () => {
        onToggleMaxHeight()
        setInputFocus(true)
    }

    return isSmallScreen(width) && !isMaxHeight ? (
        <button className={classes.searchButton} onClick={toggleMaxHeight}>
            <SearchIcon className={classes.searchIcon} />
        </button>
    ) : (
        <div
            className={cx(classes.container, `${focusedClassName}`)}
            onFocus={onFocus}
            onBlur={onBlur}
        >
            <div className={classes.searchIconContainer}>
                <SearchIcon
                    className={classes.searchIcon}
                    small={isSmallScreen(width) && isMaxHeight}
                />
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
    )
}

FilterUnconnected.propTypes = {
    clearDashboardsFilter: PropTypes.func,
    filterText: PropTypes.string,
    isMaxHeight: PropTypes.bool,
    setDashboardsFilter: PropTypes.func,
    onKeypressEnter: PropTypes.func,
    onToggleMaxHeight: PropTypes.func,
}

const mapStateToProps = state => ({
    filterText: sGetDashboardsFilter(state),
})

const mapDispatchToProps = {
    setDashboardsFilter: acSetDashboardsFilter,
    clearDashboardsFilter: acClearDashboardsFilter,
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterUnconnected)
