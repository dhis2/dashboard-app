import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Title.css';

const DEFAULTVALUE_TEXTFIELD = '';
const REF_TEXTFIELD = 'REF_TEXTFIELD';
const HINTTEXT_TEXTFIELD = 'Untitled';

const KEYCODE_ENTER = 13;

const styles = {
    description: {
        paddingLeft: '6px',
        color: '#666',
        fontSize: '13px',
        fontWeight: 400,
    },
};

export class Title extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: DEFAULTVALUE_TEXTFIELD,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            name: nextProps.name,
        });
    }
    handleKeyUp(event) {
        event.preventDefault();

        const textField = this[REF_TEXTFIELD];

        if (event.keyCode === KEYCODE_ENTER) {
            textField.blur();
        }
    }
    handleChange(event) {
        event.preventDefault();

        this.setState({
            name: event.target.value,
        });
    }
    render() {
        return (
            <div className="dashboard-title">
                <input
                    ref={c => {
                        this[REF_TEXTFIELD] = c;
                    }}
                    type="text"
                    value={this.state.name}
                    onKeyUp={this.handleKeyUp}
                    onChange={this.handleChange}
                    onBlur={this.props.onBlur}
                    placeholder={HINTTEXT_TEXTFIELD}
                    className="DashboardTitle-textfield"
                />
                <div style={styles.description}>{this.props.description}</div>
            </div>
        );
    }
}

Title.propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
    edit: PropTypes.bool,
    starred: PropTypes.bool,
    onBlur: PropTypes.func,
};

export default Title;
