import React, { Component, Fragment } from 'react';
import i18n from 'd2-i18n';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import IconClear from '@material-ui/icons/Clear';
import isEmpty from 'd2-utilizr/lib/isEmpty';

import { DEFAULT_STATE_DASHBOARDS_FILTER_NAME } from '../../reducers/dashboardsFilter';

export const KEYCODE_ENTER = 13;
export const KEYCODE_ESCAPE = 27;

const styles = {
    filterField: {
        fontSize: '14px',
        width: '200px',
        height: '30px',
        top: '-2px',
    },
    filterFieldInput: {
        top: '-9px',
        left: '1px',
    },
    filterFieldUnderline: {
        bottom: '10px',
    },
    filterFieldUnderlineFocus: {
        borderColor: '#aaa',
        borderWidth: '1px',
    },
    clearButton: {
        width: '20px',
        height: '24px',
        padding: 0,
        top: '-5px',
        left: '-18px',
    },
    clearButtonIcon: {
        width: '16px',
        height: '16px',
    },
};

export class Filter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: DEFAULT_STATE_DASHBOARDS_FILTER_NAME,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.name,
        });
    }

    setFilterValue = event => {
        event.preventDefault();

        this.props.onChangeName(event.target.value);
    };

    handleKeyUp = event => {
        switch (event.keyCode) {
            case KEYCODE_ENTER:
                this.props.onKeypressEnter();
                break;
            case KEYCODE_ESCAPE:
                this.props.onChangeName();
                break;
            default:
                break;
        }
    };

    render() {
        return (
            <TextField
                className="FilterField"
                value={this.state.value}
                onChange={this.setFilterValue}
                onKeyUp={this.handleKeyUp}
                hintText={i18n.t('Search for a dashboard')}
                style={styles.filterField}
                inputStyle={styles.filterFieldInput}
                hintStyle={styles.filterFieldHint}
                underlineStyle={styles.filterFieldUnderline}
                underlineFocusStyle={styles.filterFieldUnderlineFocus}
            />
        );
    }
}

Filter.propTypes = {
    name: PropTypes.string,
    onChangeName: PropTypes.func,
};

Filter.defaultProps = {
    name: '',
    onChangeName: Function.prototype,
};

export const ClearButton = ({ name, onChangeName }) => {
    const disabled = isEmpty(name);

    const clearFilter = () => onChangeName();

    return (
        <IconButton
            style={Object.assign({}, styles.clearButton, {
                opacity: disabled ? 0 : 1,
            })}
            iconStyle={styles.clearButtonIcon}
            onClick={clearFilter}
            disabled={disabled}
        >
            <IconClear color="action" />
        </IconButton>
    );
};

ClearButton.propTypes = {
    name: PropTypes.string.isRequired,
    onChangeName: PropTypes.func.isRequired,
};

export default props => (
    <Fragment>
        <Filter {...props} />
        <ClearButton {...props} />
    </Fragment>
);
