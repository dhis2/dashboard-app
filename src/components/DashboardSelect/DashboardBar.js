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
    height: 40,
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

class DashboardBar extends Component {
    render() {
        return (
            <Toolbar style={toolbarStyle}>
                <ToolbarGroup firstChild={true}>
                    <IconButton style={iconButtonStyle} iconStyle={iconStyle}>
                        <ActionAdd color={blue500} />
                    </IconButton>
                    <IconButton style={iconButtonStyle} iconStyle={iconStyle}>
                        <ActionSettings />
                    </IconButton>
                </ToolbarGroup>
            </Toolbar>
        );
    }
}

export default DashboardBar;