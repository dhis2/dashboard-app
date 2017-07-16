import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './DashboardBar.css';

import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import IconButton from 'material-ui/IconButton';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import ActionAdd from 'material-ui/svg-icons/content/add-circle';

import { blue500 } from 'material-ui/styles/colors';

const toolbarStyle = {
    height: 36,
    backgroundColor: 'transparent'
};

const buttonStyle = {
    //boxShadow: '#aaa 0 0 5px'
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

class DashboardBar extends Component {
    render() {
        return (
            <Toolbar style={toolbarStyle}>
                <ToolbarGroup firstChild={true}>
                    <div>
                        <IconButton style={iconButtonStyle} iconStyle={iconStyle}>
                            <ActionAdd color={blue500} />
                        </IconButton>
                        <span className="DashboardBar-link icontext">Add new</span>
                    </div>
                    <div>
                    <IconButton style={iconButtonStyle} iconStyle={iconStyle}>
                        <ActionSettings />
                    </IconButton>
                        <span className="DashboardBar-link icontext">Manage dashboards</span>
                    </div>
                    <ToolbarSeparator style={toolbarSeparatorStyle}/>
                </ToolbarGroup>
                <ToolbarGroup>
                    <div>
                        <span className="DashboardBar-link fieldtext">Select view:</span>
                        <span className="separator"></span>
                        <span className="DashboardBar-link selected">Compact</span>
                        <span className="separator"></span>
                        <span className="DashboardBar-link">List</span>
                        <span className="separator"></span>
                        <span className="DashboardBar-link">Icon</span>
                    </div>
                </ToolbarGroup>
            </Toolbar>
        );
    }
}

export default DashboardBar;