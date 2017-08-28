import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './DashboardBar.css';
import { blue500, grey700 } from 'material-ui/styles/colors';

import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import IconAdd from 'material-ui/svg-icons/content/add-circle';
import IconSettings from 'material-ui/svg-icons/action/settings';
import IconClear from 'material-ui/svg-icons/content/clear';
import IconList from 'material-ui/svg-icons/action/list';
import ListViewModule from 'material-ui/svg-icons/action/view-module';

import isEmpty from 'd2-utilizr/lib/isEmpty';

import * as fromReducers from '../../reducers';

const styles = {
    icon: {
        width: 24,
        height: 24
    },
    iconButton: {
        width: 56,
        height: 56,
        padding: 8,
        position: 'relative',
        top: '4px'
    },
    iconText: {
        position: 'relative',
        top: '-2px',
        left: '-11px'
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
        fontSize: '14px',
        fontWeight: 400,
        color: '#000',
        cursor: 'pointer'
    },
    linkSelected: {
        color: '#000'
    },
    linkHover: {
        color: '#666'
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
        height: 52,
        backgroundColor: 'transparent'
    },
    toolbarSeparator: {
        height: '20px',
        marginLeft: '9px'
    }
};

const getLinkLabel = ({ label }) =>
    <span style={Object.assign({}, styles.link, styles.linkLabel)}>{label}:</span>;

const getSeparator = () =>
    <span style={styles.separator} />;

const getSeparatorLine = () =>
    <span style={styles.separatorLine} />;

class Link extends Component {
    constructor(props) {
        super(props);

        this.onMouseOverHandle = this.onMouseOverHandle.bind(this);
        this.onMouseOutHandle = this.onMouseOutHandle.bind(this);

        this.state = {
            color: styles.link.color
        };
    }

    onMouseOverHandle() {
        this.setState({
            color: styles.linkHover.color
        });
    }

    onMouseOutHandle() {
        this.setState({
            color: styles.link.color
        });
    }

    render() {
        const { text, onClick, isSelected, style } = this.props;
        const selectedStyle = isSelected ? styles.linkSelected : null;

        return (
            <span
                style={Object.assign({}, styles.link, style, this.state, selectedStyle)}
                onClick={onClick}
                onMouseOver={this.onMouseOverHandle}
                onMouseOut={this.onMouseOutHandle}
            >
                {text}
            </span>
        );
    }
}

const getLink = ({ text, onClick, isSelected, style }) =>
    <Link
        text={text}
        onClick={onClick}
        isSelected={isSelected}
        style={style} />;

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

const ManageButton = ({ onClickManage }) => (
    <div>
        <IconButton style={styles.iconButton} iconStyle={styles.icon}>
            <IconSettings/>
        </IconButton>
        {getIconLink({ text: 'Manage dashboards', onClick: onClickManage })}
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

        this.props.onChangeTextFilter(event.target.value);
    }

    handleKeyUp(event) {
        const KEYCODE_ESCAPE = 27;

        if (event.keyCode === KEYCODE_ESCAPE) {
            this.props.onChangeTextFilter();
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

const ClearButton = ({ onChangeTextFilter, textFilter }) => {
    const disabled = isEmpty(textFilter);

    return (
        <IconButton
            style={Object.assign({}, styles.clearButton, {opacity: disabled ? 0 : 1})}
            iconStyle={styles.clearButtonIcon}
            onClick={() => onChangeTextFilter()}
            disabled={disabled}
        >
            <IconClear color={grey700} />
        </IconButton>
    );
};

ClearButton.propTypes = {
    onChangeTextFilter: PropTypes.func.isRequired,
    textFilter: PropTypes.string.isRequired
};

const Show = props => {
    const all = fromReducers.fromDashboardsConfig.showFilterValues.ALL;
    const starred = fromReducers.fromDashboardsConfig.showFilterValues.STARRED;

    const { showFilter, onClickShowFilter } = props;

    return (
        <div>
            {getLinkLabel({ label: 'Show' })}
            {getSeparator()}
            {getLink({ text: 'All', onClick: () => onClickShowFilter(all), isSelected: all === showFilter })}
            {getSeparator()}
            {getLink({ text: 'Starred', onClick: () => onClickShowFilter(starred), isSelected: starred === showFilter })}
        </div>
    );
};

class ShowMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.showFilter
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, index, value) {
        console.log(this.state.value, value);

        if (value !== this.state.value) {
            this.setState({value});

            this.props.onClickShowFilter(value);
        }
    }

    render() {
        var showMenu = {
            defaultFontStyle: {
                color: '#222',
                fontSize: '14px'
            },
            labelStyle: {},
            listStyle: {
                padding: '10px 0 !important'
            },
            menuItemStyle: {},
            selectedMenuItemStyle: {
                fontWeight: 500
            },
            underlineStyle: {
                border: '0 none'
            }
        };

        return (
            <DropDownMenu
                value={this.state.value}
                onChange={this.handleChange}
                labelStyle={Object.assign({}, showMenu.defaultFontStyle, showMenu.labelStyle)}
                listStyle={Object.assign({}, showMenu.defaultFontStyle, showMenu.listStyle)}
                menuItemStyle={Object.assign({}, showMenu.defaultFontStyle, showMenu.menuItemStyle)}
                selectedMenuItemStyle={Object.assign({}, showMenu.defaultFontStyle, showMenu.selectedMenuItemStyle)}
                menuStyle={{padding: 0}}
                style={showMenu.style}
                underlineStyle={showMenu.underlineStyle}
            >
                <MenuItem value={'ALL'} primaryText="All items"/>
                <MenuItem value={'STARRED'} primaryText="Starred"/>
            </DropDownMenu>
        );
    }
}

class SortMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.sortFilterId
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, index, value) {
        console.log(this.state.value, value);
        const sortFilter = fromReducers.fromDashboardsConfig.uGetSortFilterFromId(value);

        if (value !== this.state.value) {
            this.setState({ value });

            this.props.onClickSortFilterKey(sortFilter.key);
            this.props.onClickSortFilterDirection(sortFilter.direction);
        }
    }

    render() {
        var sortMenu = {
            defaultFontStyle: {
                color: '#222',
                fontSize: '14px'
            },
            labelStyle: {},
            listStyle: {
                padding: '10px 0 !important'
            },
            menuItemStyle: {},
            selectedMenuItemStyle: {
                fontWeight: 500
            },
            underlineStyle: {
                border: '0 none'
            }
        };

        return (
            <DropDownMenu
                value={this.state.value}
                onChange={this.handleChange}
                labelStyle={Object.assign({}, sortMenu.defaultFontStyle, sortMenu.labelStyle)}
                listStyle={Object.assign({}, sortMenu.defaultFontStyle, sortMenu.listStyle)}
                menuItemStyle={Object.assign({}, sortMenu.defaultFontStyle, sortMenu.menuItemStyle)}
                selectedMenuItemStyle={Object.assign({}, sortMenu.defaultFontStyle, sortMenu.selectedMenuItemStyle)}
                menuStyle={{padding: 0}}
                style={sortMenu.style}
                underlineStyle={sortMenu.underlineStyle}
            >
                <MenuItem value={'NAME_ASC'} primaryText="Name (A-Z)" />
                <MenuItem value={'NAME_DESC'} primaryText="Name (Z-A)" />
                <MenuItem value={'ITEMS_ASC'} primaryText="Number of items (0-9)" />
                <MenuItem value={'ITEMS_DESC'} primaryText="Number of items (9-0)" />
                <MenuItem value={'CREATED_ASC'} primaryText="Created date (0-9)" />
                <MenuItem value={'CREATED_DESC'} primaryText="Created date (9-0)" />
            </DropDownMenu>
        );
    }
}

const ViewPanel = props => {
    const list = fromReducers.fromDashboardsConfig.viewFilterValues.LIST;
    const table = fromReducers.fromDashboardsConfig.viewFilterValues.TABLE;

    const { viewFilter } = props;

    const buttonColor = grey700;

    const onClickViewFilterParamMap = {
        [list]: table,
        [table]: list
    };

    function onClick() {
        props.onClickViewFilter(onClickViewFilterParamMap[viewFilter]);
    }

    const buttonMap = {
        [list]: <IconList color={buttonColor} />,
        [table]: <ListViewModule color={buttonColor} />
    };

    return (
        <IconButton style={styles.iconButton} iconStyle={styles.icon} onClick={onClick}>
            {buttonMap[viewFilter]}
        </IconButton>
    );
};

const DashboardBar = props => (
    <Toolbar style={styles.toolbar}>
        <ToolbarGroup firstChild={true}>
            <AddButton/>
            <ManageButton {...props} />
            <ToolbarSeparator style={styles.toolbarSeparator}/>
            <FilterField {...props} />
            <ClearButton {...props} />
        </ToolbarGroup>
        <ToolbarGroup lastChild={true}>
            <ShowMenu {...props} />
            <SortMenu {...props} />
            <ViewPanel {...props} />
        </ToolbarGroup>
    </Toolbar>
);

export default DashboardBar;