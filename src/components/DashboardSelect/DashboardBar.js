import React, { Component } from 'react';

import './DashboardBar.css';
import { blue500, grey700 } from 'material-ui/styles/colors';

import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import IconAdd from 'material-ui/svg-icons/content/add-circle';
import IconSettings from 'material-ui/svg-icons/action/settings';
import IconClear from 'material-ui/svg-icons/content/clear';

import isEmpty from 'd2-utilizr/lib/isEmpty';

import * as fromReducers from '../../reducers';

function DashboardBar(props) {

    const styles = {
        icon: {
            width: 20,
            height: 20
        },
        iconButton: {
            width: 36,
            height: 36,
            padding: 8
        },
        iconText: {
            position: 'relative',
            top: '-5px',
            left: '-5px'
        },
        clearButton: {
            width: '28px',
            height: '28px',
            padding: 0,
            position: 'relative',
            left: '-25px'
        },
        clearButtonIcon: {
            width: '16px',
            height: '16px'
        },
        link: {
            fontSize: '13px',
            fontWeight: 500,
            color: '#666',
            cursor: 'pointer'
        },
        linkSelected: {
            color: '#000'
        },
        linkLabel: {
            fontWeight: 400,
            color: '#666'
        },
        separator: {
            paddingLeft: '6px'
        },
        separatorLine: {
            position: 'relative',
            top: '-1px',
            paddingLeft: '7px',
            borderRight: '1px solid #aaa'
        },
        toolbar: {
            height: 36,
            backgroundColor: 'transparent'
        },
        toolbarSeparator: {
            height: '20px',
            marginLeft: '9px'
        }
    };

    const getLinkLabel = ({ label }) => <span style={Object.assign({}, styles.link, styles.linkLabel)}>{label}:</span>;

    const getSeparator = () => <span style={styles.separator} />;

    const getSeparatorLine = () => <span style={styles.separatorLine} />;

    const getLink = ({ text, onClick, isSelected, style }) =>
        <span
            className="DashboardBar-link"
            style={Object.assign({}, styles.link, style, isSelected ? styles.linkSelected : null)}
            onClick={onClick}>{text}</span>;

    const getIconLink = ({ text, onClick }) => getLink({ text, onClick, style: styles.iconText });

    // components

    const AddButton = () => (
        <div>
            <IconButton style={styles.iconButton} iconStyle={styles.icon}>
                <IconAdd color={blue500}/>
            </IconButton>
            {getIconLink({ text: 'New', onClick: console.log })}
        </div>
    );

    const ManageButton = () => (
        <div>
            <IconButton style={styles.iconButton} iconStyle={styles.icon}>
                <IconSettings/>
            </IconButton>
            {getIconLink({ text: 'Manage dashboards', onClick: console.log })}
        </div>
    );

    class FilterField extends Component {
        constructor(props) {
            super(props);

            this.state = {
                value: fromReducers.fromDashboardsConfig.DEFAULT_DASHBOARDSCONFIG_TEXTFILTER
            };

            this.setFilterValue = this.setFilterValue.bind(this);
            this.handleKeyUp = this.handleKeyUp.bind(this);
        }

        componentWillReceiveProps(nextProps) {
            this.setState({
                value: nextProps.textFilter
            });
        }

        setFilterValue(event) {
            event.preventDefault();

            this.props.onChangeFilter(event.target.value);
        }

        handleKeyUp(event) {
            const KEYCODE_ESCAPE = 27;

            if (event.keyCode === KEYCODE_ESCAPE) {
                this.props.onChangeFilter();
            }
        }

        render() {
            return (
                <TextField
                    className="FilterField"
                    value={this.state.value}
                    onChange={this.setFilterValue}
                    onKeyUp={this.handleKeyUp}
                    hintText="Filter dashboards"
                    style={{marginLeft: '14px', height: '36px', fontSize: '13px', width: '200px'}}
                    inputStyle={{top: '1px'}}
                    hintStyle={{top: '8px'}}
                    underlineStyle={{bottom: '5px'}}
                    underlineFocusStyle={{bottom: '5px', borderColor: '#aaa', borderWidth: '1px'}}
                />
            );
        }
    }

    const ClearButton = ({ onChangeFilter, dashboardsFilter }) => {
        const disabled = isEmpty(dashboardsFilter);

        return (
            <IconButton
                style={Object.assign({}, styles.clearButton, {opacity: disabled ? 0 : 1})}
                iconStyle={styles.clearButtonIcon}
                onClick={() => onChangeFilter()}
                disabled={disabled}
            >
                <IconClear color={grey700} />
            </IconButton>
        );
    };

    const ShowPanel = () => (
        <div>
            {getLinkLabel({ label: 'Show' })}
            {getSeparator()}
            {getLink({ text: 'All', onClick: console.log, isSelected: true })}
            {getSeparator()}
            {getLink({ text: 'Starred', onClick: console.log })}
        </div>
    );

    const SortPanel = () => (
        <div>
            {getLinkLabel({ label: 'Sort by' })}
            {getSeparator()}
            {getLink({ text: 'Name', onClick: console.log, isSelected: true })}
            {getSeparator()}
            {getLink({ text: 'Created', onClick: console.log })}
            {getSeparatorLine()}
            {getSeparator()}
            {getLink({ text: 'ASC', onClick: console.log, isSelected: true })}
            {getSeparator()}
            {getLink({ text: 'DESC', onClick: console.log })}
        </div>
    );

    const ViewPanel = () => {
        const list = fromReducers.fromDashboardsConfig.viewFilterValues.LIST;
        const table = fromReducers.fromDashboardsConfig.viewFilterValues.TABLE;

        const { viewFilter } = props;

        return (
            <div>
                {getLinkLabel({ label: 'View' })}
                {getSeparator()}
                {getLink({ text: 'List', onClick: () => props.onClickViewFilter(list), isSelected: list === viewFilter })}
                {getSeparator()}
                {getLink({ text: 'Table', onClick: () => props.onClickViewFilter(table), isSelected: table === viewFilter })}
            </div>
        );
    }

    return (
        <Toolbar style={styles.toolbar}>
            <ToolbarGroup firstChild={true}>
                <AddButton/>
                <ManageButton/>
                <ToolbarSeparator style={styles.toolbarSeparator}/>
                <FilterField {...props} />
                <ClearButton {...props} />
            </ToolbarGroup>
            <ToolbarGroup>
                <ShowPanel/>
            </ToolbarGroup>
            <ToolbarGroup>
                <SortPanel/>
            </ToolbarGroup>
            <ToolbarGroup>
                <ViewPanel/>
            </ToolbarGroup>
        </Toolbar>
    );
}

export default DashboardBar;