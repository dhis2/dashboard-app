import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './DashboardBar.css';

import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import IconAdd from 'material-ui/svg-icons/content/add-circle';
import IconSettings from 'material-ui/svg-icons/action/settings';
import IconClear from 'material-ui/svg-icons/content/clear';

import { blue500, grey700 } from 'material-ui/styles/colors';

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
            <IconAdd color={blue500} />
        </IconButton>
        <span className="DashboardBar-link icontext">New</span>
    </div>
);

const ManageButton = () => (
    <div>
        <IconButton style={iconButtonStyle} iconStyle={iconStyle}>
            <IconSettings />
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

        this.setFilterValue = this.setFilterValue.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        console.log("componentWillReceiveProps", nextProps);

        this.setState({
            value: nextProps.dashboardFilter
        });
    }
    setFilterValue(event) {
        event.preventDefault();

        this.props.onChangeFilter(event.target.value);
    }
    render() {
        return (
            <TextField
                className="FilterField"
                value={this.state.value}
                onChange={this.setFilterValue}
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

const ClearButton = ({ onChangeFilter, dashboardFilter }) => {
    const disabled = dashboardFilter === '';
    const opacity = disabled ? 0 : 1;

    return (
        <IconButton
            style={{
                width: '28px',
                height: '28px',
                padding: 0,
                position: 'relative',
                left: '-25px',
                opacity: opacity
            }}
            iconStyle={{width: '16px', height: '16px'}}
            onClick={() => onChangeFilter('')}
            disabled={disabled}
        >
            <IconClear color={grey700} />
        </IconButton>
    );
};

ClearButton.propTypes = {
    onChangeFilter: PropTypes.func,
    dashboardFilter: PropTypes.string
};

const ViewPanel = () => (
    <div>
        <span className="DashboardBar-link fieldtext">View:</span>
        <span className="separator"></span>
        <span className="DashboardBar-link selected">Compact</span>
        <span className="separator"></span>
        <span className="DashboardBar-link">Detailed</span>
    </div>
);

const SortPanel = () => (
    <div>
        <span className="DashboardBar-link fieldtext">Sort by:</span>
        <span className="separator"></span>
        <span className="DashboardBar-link selected">A-Z</span>
        <span className="separator"></span>
        <span className="DashboardBar-link">Z-A</span>
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
                    <ClearButton {...this.props} />
                </ToolbarGroup>
                <ToolbarGroup>
                    <ViewPanel />
                </ToolbarGroup>
                <ToolbarGroup>
                    <SortPanel />
                </ToolbarGroup>
            </Toolbar>
        );
    }
}

export default DashboardBar;