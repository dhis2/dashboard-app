import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import InputField from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import { colors } from '@dhis2/ui-core';

import ClearButton from './ClearButton';
import { DEFAULT_STATE_DASHBOARDS_FILTER_NAME } from '../../reducers/dashboardsFilter';

export const KEYCODE_ENTER = 13;
export const KEYCODE_ESCAPE = 27;

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
};

export const Filter = props => {
    const [value, setValue] = useState(DEFAULT_STATE_DASHBOARDS_FILTER_NAME);

    useEffect(() => {
        setValue(props.name);
    }, [props.name]);

    const setFilterValue = event => {
        event.preventDefault();

        props.onChangeName(event.target.value);
    };

    const handleKeyUp = event => {
        switch (event.keyCode) {
            case KEYCODE_ENTER:
                props.onKeypressEnter();
                break;
            case KEYCODE_ESCAPE:
                props.onChangeName();
                break;
            default:
                break;
        }
    };

    const startAdornment = (
        <InputAdornment position="start">
            <SearchIcon className={props.classes.searchIcon} />
        </InputAdornment>
    );

    const endAdornment =
        props.name !== '' && props.name !== null ? (
            <InputAdornment position="end">
                <ClearButton onClear={() => props.onChangeName()} />
            </InputAdornment>
        ) : null;

    return (
        <InputField
            className={props.classes.filterField}
            placeholder={i18n.t('Search for a dashboard')}
            startAdornment={startAdornment}
            endAdornment={endAdornment}
            value={value}
            onChange={setFilterValue}
            onKeyUp={handleKeyUp}
        />
    );
};

Filter.propTypes = {
    name: PropTypes.string,
    onChangeName: PropTypes.func,
};

Filter.defaultProps = {
    name: '',
    onChangeName: Function.prototype,
};

export default withStyles(styles)(Filter);
