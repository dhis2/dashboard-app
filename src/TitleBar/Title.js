import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './DashboardTitle.css';

import * as fromReducers from '../reducers';
import { orObject } from '../util';

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

export class DashboardTitle extends Component {
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

DashboardTitle.propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
    edit: PropTypes.bool,
    starred: PropTypes.bool,
    onBlur: PropTypes.func,
};

// Container

const mapStateToProps = state => {
    const { fromSelected, sGetSelectedDashboard } = fromReducers;
    const { sGetSelectedEdit } = fromSelected;

    const selectedDashboard = orObject(sGetSelectedDashboard(state));

    return {
        name: selectedDashboard.name,
        description: selectedDashboard.description,
        starred: selectedDashboard.starred,
        edit: sGetSelectedEdit(state),
    };
};

const mapDispatchToProps = () => ({
    onBlur: e => console.log('dashboard name: ', e.target.value),
});

const DashboardTitleCt = connect(mapStateToProps, mapDispatchToProps)(
    DashboardTitle
);

export default DashboardTitleCt;
