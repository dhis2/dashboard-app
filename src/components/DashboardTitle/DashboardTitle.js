import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './DashboardTitle.css';

const hintText = 'Untitled';

class DashboardTitle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: ''
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            name: nextProps.name
        });
    }
    onChangeHandler(event) {
        this.setState({
            name: event.target.value
        });
    }
    render() {
        return (
            <input
                type="text"
                value={this.state.name}
                onChange={this.onChangeHandler}
                onBlur={this.props.onBlur}
                placeholder={hintText}
                className="DashboardTitle-textfield"
            />
        );
    }
}

export default DashboardTitle;