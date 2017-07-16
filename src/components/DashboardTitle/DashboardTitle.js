import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './DashboardTitle.css';

const hintText = 'Untitled';

const ENTER = 13;

class DashboardTitle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: ''
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

        if (event.keyCode === ENTER) {
            this.refs.textfield.blur();
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
                ref="textfield"
                type="text"
                value={this.state.name}
                onKeyUp={this.handleKeyUp}
                onChange={this.handleChange}
                onBlur={this.props.onBlur}
                placeholder={hintText}
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