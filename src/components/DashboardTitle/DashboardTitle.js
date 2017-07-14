import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './DashboardTitle.css';

const hintText = 'Untitled';

class DashboardTitle extends Component {
    constructor() {
        super();

        this.state = {
            name: ''
        };

        this.handleChange = this.handleChange.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        console.log("componentWillReceiveProps", nextProps);

        this.setState({
            name: nextProps.name
        });
    }
    handleChange(event) {
        this.setState({
            name: event.target.value
        });
    }
    render() {
        return (
            <input
                type="text"
                value={this.state.name}
                onChange={this.handleChange}
                onBlur={this.props.onBlur}
                placeholder={hintText}
                className="DashboardTitle-textfield"
            />
        );
    }
}

export default DashboardTitle;