import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { grey700 } from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import IconClear from 'material-ui/svg-icons/content/clear';
import isEmpty from 'd2-utilizr/lib/isEmpty';

import * as fromReducers from '../reducers';
import * as fromActions from '../actions';

const KEYCODE_ESCAPE = 27;

const styles = {
    filterField: {
        fontSize: '14px',
        width: '200px',
        height: '30px',
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
        width: '24px',
        height: '24px',
        padding: 0,
        top: '-3px',
        left: '-22px',
    },
    clearButtonIcon: {
        width: '16px',
        height: '16px',
    },
};

class Filter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: fromReducers.fromFilter.DEFAULT_NAME,
        };

        this.setFilterValue = this.setFilterValue.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.name,
        });
    }

    setFilterValue(event) {
        event.preventDefault();

        this.props.onChangeName(event.target.value);
    }

    handleKeyUp(event) {
        if (event.keyCode === KEYCODE_ESCAPE) {
            this.props.onChangeName();
        }
    }

    render() {
        return (
            <TextField
                className="FilterField"
                value={this.state.value}
                onChange={this.setFilterValue}
                onKeyUp={this.handleKeyUp}
                hintText="Filter dashboards"
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

const ClearButton = ({ name, onChangeName }) => {
    const disabled = isEmpty(name);

    return (
        <IconButton
            style={Object.assign({}, styles.clearButton, {
                opacity: disabled ? 0 : 1,
            })}
            iconStyle={styles.clearButtonIcon}
            onClick={() => onChangeName()}
            disabled={disabled}
        >
            <IconClear color={grey700} />
        </IconButton>
    );
};

ClearButton.propTypes = {
    name: PropTypes.string.isRequired,
    onChangeName: PropTypes.func.isRequired,
};

const ReactFragment = props => props.children;

export default props => (
    <ReactFragment>
        <Filter {...props} />
        <ClearButton {...props} />
    </ReactFragment>
);
