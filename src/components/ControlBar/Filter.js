import React, { Component } from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { withStyles } from '@material-ui/core/styles'
import InputField from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import { colors } from '@dhis2/ui'

import ClearButton from './ClearButton'
import { DEFAULT_STATE_DASHBOARDS_FILTER_NAME } from '../../reducers/dashboardsFilter'

const styles = {
    filterField: {
        fontSize: '14px',
        width: '200px',
        height: '30px',
        top: '-4px',
    },
    searchIcon: {
        color: colors.grey700,
        width: '20px',
        height: '20px',
    },
}

export const KEYCODE_ENTER = 13
export const KEYCODE_ESCAPE = 27

export class Filter extends Component {
    constructor(props) {
        super(props)

        this.state = {
            value: DEFAULT_STATE_DASHBOARDS_FILTER_NAME,
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.name,
        })
    }

    setFilterValue = event => {
        event.preventDefault()

        this.props.onChangeName(event.target.value)
    }

    handleKeyUp = event => {
        switch (event.keyCode) {
            case KEYCODE_ENTER:
                this.props.onKeypressEnter()
                break
            case KEYCODE_ESCAPE:
                this.props.onChangeName()
                break
            default:
                break
        }
    }

    render() {
        const { classes, name, onChangeName } = this.props

        const startAdornment = (
            <InputAdornment position="start">
                <SearchIcon className={classes.searchIcon} />
            </InputAdornment>
        )

        const endAdornment =
            name !== '' && name !== null ? (
                <InputAdornment position="end">
                    <ClearButton onClear={() => onChangeName()} />
                </InputAdornment>
            ) : null

        return (
            <InputField
                className={classes.filterField}
                placeholder={i18n.t('Search for a dashboard')}
                startAdornment={startAdornment}
                endAdornment={endAdornment}
                value={this.state.value}
                onChange={this.setFilterValue}
                onKeyUp={this.handleKeyUp}
                data-test="dhis2-dashboard-search-dashboard-input"
            />
        )
    }
}

Filter.propTypes = {
    classes: PropTypes.object,
    name: PropTypes.string,
    onChangeName: PropTypes.func,
    onKeypressEnter: PropTypes.func,
}

Filter.defaultProps = {
    name: '',
    onChangeName: Function.prototype,
}

export default withStyles(styles)(Filter)
