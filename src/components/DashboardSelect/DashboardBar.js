import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './DashboardBar.css';

import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import ActionAdd from 'material-ui/svg-icons/content/add-circle';
import ActionSettings from 'material-ui/svg-icons/action/settings';

import { blue500 } from 'material-ui/styles/colors';

const toolbarStyle = {
    height: 36,
    backgroundColor: 'transparent'
};

const iconStyle = {
    width: 20,
    height: 20
};

const iconButtonStyle = {
    width: 36,
    height: 36,
    padding: 8
};

const toolbarSeparatorStyle = {
    height: '20px',
    marginLeft: '15px'
};

const AddButton = () => (
    <div>
        <IconButton style={iconButtonStyle} iconStyle={iconStyle}>
            <ActionAdd color={blue500} />
        </IconButton>
        <span className="DashboardBar-link icontext">New</span>
    </div>
);

const ManageButton = () => (
    <div>
        <IconButton style={iconButtonStyle} iconStyle={iconStyle}>
            <ActionSettings />
        </IconButton>
        <span className="DashboardBar-link icontext">Manage dashboards</span>
    </div>
);

class FilterField extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: ''
        };

        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) {
        event.preventDefault();

        this.setState({
            value: event.target.value
        });
console.log("this.props:", this.props);
        this.props.onChangeFilter(event.target.value);

        console.log("filter value:", event.target.value);
    }
    render() {
        return (
            <TextField
                className="FilterField"
                value={this.state.value}
                onChange={this.handleChange}
                hintText="Filter dashboards"
                style={{marginLeft: '18px', height: '36px', fontSize: '13px'}}
                inputStyle={{top: '1px'}}
                hintStyle={{top: '8px'}}
                underlineStyle={{bottom: '5px'}}
                underlineFocusStyle={{bottom: '5px', borderColor: '#aaa', borderWidth: '1px'}}
            />
        );
    }
}

const ViewPanel = () => (
    <div>
        <span className="DashboardBar-link fieldtext">Select view:</span>
        <span className="separator"></span>
        <span className="DashboardBar-link selected">Compact</span>
        <span className="separator"></span>
        <span className="DashboardBar-link">Detailed</span>
    </div>
);

class DashboardBar extends Component {
    render() {
        return (
            <Toolbar style={toolbarStyle}>
                <ToolbarGroup firstChild={true}>
                    <AddButton />
                    <ManageButton />
                    <ToolbarSeparator style={toolbarSeparatorStyle}/>
                    <FilterField {...this.props} />
                </ToolbarGroup>
                <ToolbarGroup>
                    <ViewPanel />
                </ToolbarGroup>
            </Toolbar>
        );
    }
}

export default DashboardBar;