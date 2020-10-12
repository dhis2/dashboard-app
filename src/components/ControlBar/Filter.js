import React, { useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import SearchIcon from '../../icons/Search'
import ClearButton from './ClearButton'

import { acSetFilterName } from '../../actions/dashboardsFilter'
import { sGetFilterName } from '../../reducers/dashboardsFilter'

import classes from './styles/Filter.module.css'

export const KEYCODE_ENTER = 13
export const KEYCODE_ESCAPE = 27

export const Filter = ({ filterText, onChangeFilterText, onKeypressEnter }) => {
    const [focusedClassName, setFocusedClassName] = useState('')
    const setFilterValue = event => {
        event.preventDefault()
        onChangeFilterText(event.target.value)
    }

    const clearFilterText = () => {
        onChangeFilterText()
    }

    const onKeyUp = event => {
        switch (event.keyCode) {
            case KEYCODE_ENTER:
                onKeypressEnter()
                clearFilterText()
                break
            case KEYCODE_ESCAPE:
                clearFilterText()
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

    return (
        <div
            className={cx(classes.container, `${focusedClassName}`)}
            onFocus={onFocus}
            onBlur={onBlur}
        >
            <SearchIcon className={classes.searchIcon} />
            <input
                className={classes.input}
                type="text"
                placeholder={i18n.t('Search for a dashboard')}
                onChange={setFilterValue}
                onKeyUp={onKeyUp}
                value={filterText}
            />
            {filterText && <ClearButton onClear={() => clearFilterText()} />}
        </div>
    )
}

Filter.propTypes = {
    filterText: PropTypes.string,
    onChangeFilterText: PropTypes.func,
    onKeypressEnter: PropTypes.func,
}

const mapStateToProps = state => ({
    filterText: sGetFilterName(state),
})

const mapDispatchToProps = { onChangeFilterText: acSetFilterName }

export default connect(mapStateToProps, mapDispatchToProps)(Filter)
