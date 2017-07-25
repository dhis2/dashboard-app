import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './DashboardTitle.css';

const DEFAULTVALUE_TEXTFIELD = '';
const REF_TEXTFIELD = 'REF_TEXTFIELD';
const HINTTEXT_TEXTFIELD = 'Untitled';

const KEYCODE_ENTER = 13;

class DashboardTitle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: DEFAULTVALUE_TEXTFIELD
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            name: nextProps.name
        });
    }
    handleKeyUp(event) {
        event.preventDefault();

        const textField = this.refs[REF_TEXTFIELD];

        if (event.keyCode === KEYCODE_ENTER) {
            textField.blur();
        }
    }
    handleChange(event) {
        event.preventDefault();

        this.setState({
            name: event.target.value
        });
    }
    render() {
        return (
            <input
                ref={REF_TEXTFIELD}
                type="text"
                value={this.state.name}
                onKeyUp={this.handleKeyUp}
                onChange={this.handleChange}
                onBlur={this.props.onBlur}
                placeholder={HINTTEXT_TEXTFIELD}
                className="DashboardTitle-textfield"
            />
        );
    }
}

DashboardTitle.propTypes = {
    name: PropTypes.string,
    onBlur: PropTypes.func
};

export default DashboardTitle;