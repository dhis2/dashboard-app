import './Toolbar.css';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { blue500, grey700 } from 'material-ui/styles/colors';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import IconAdd from 'material-ui/svg-icons/content/add-circle';
import IconClear from 'material-ui/svg-icons/content/clear';
import IconList from 'material-ui/svg-icons/action/list';
import ListViewModule from 'material-ui/svg-icons/action/view-module';

import isEmpty from 'd2-utilizr/lib/isEmpty';

import Textlink from '../widgets/Textlink';
import Iconbutton from '../widgets/Iconbutton';

import * as fromReducers from '../../reducers';

const styles = {
    filterField: {
        fontSize: '14px',
        width: '200px'
    },
    filterFieldInput2: {
        top: '4px'
    },
    filterFieldHint2: {
        top: '10px'
    },
    filterFieldUnderline: {
        bottom: '11px'
    },
    filterFieldUnderlineFocus: {
        borderColor: '#aaa',
        borderWidth: '1px'
    },
    clearButton: {
        width: '24px',
        height: '24px',
        padding: 0,
        left: '-22px'
    },
    clearButtonIcon: {
        width: '16px',
        height: '16px'
    },
    dropDownMenu: {
        defaultFontStyle: {
            color: '#222',
            fontSize: '14px'
        },
        labelStyle: {
            position: 'relative',
            top: '-2px'
        },
        listStyle: {
            padding: '10px 0 !important'
        },
        iconStyle: {
            top: '2px'
        },
        selectedMenuItemStyle: {
            fontWeight: 500
        },
        underlineStyle: {
            border: '0 none'
        },
        style: {
            height: '52px'
        }
    },
    toolbar: {
        height: 52,
        backgroundColor: '#fff',
        paddingTop: '10px',
        paddingBottom: '8px'
    },
    toolbarSeparator: {
        height: '26px',
        marginRight: '20px',
        marginLeft: '5px',
    },
    toolbarTextLink: {
        whiteSpace: 'nowrap'
    },
    hiddenToolbarSeparator: {
        backgroundColor: 'transparent'
    }
};

const getTextlink = ({ text, onClick, style, hoverStyle }) =>
    <Textlink
        text={text}
        onClick={onClick}
        style={style}
        hoverStyle={hoverStyle}
    />;

// components

const NewButton = () => (
    <IconButton style={styles.iconButton} iconStyle={styles.icon}>
        <IconAdd color={blue500}/>
    </IconButton>
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
                style={styles.filterField}
                inputStyle={styles.filterFieldInput}
                hintStyle={styles.filterFieldHint}
                underlineStyle={styles.filterFieldUnderline}
                underlineFocusStyle={styles.filterFieldUnderlineFocus}
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

class ShowMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.showFilter
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.showFilter
        });
    }

    handleChange(event, index, value) {
        console.log(this.state.value, value);

        if (value !== this.state.value) {
            this.setState({value});

            this.props.onClickShowFilter(value);
        }
    }

    render() {
        const all = fromReducers.fromDashboardsConfig.showFilterValues.ALL;
        const starred = fromReducers.fromDashboardsConfig.showFilterValues.STARRED;
        const unstarred = fromReducers.fromDashboardsConfig.showFilterValues.UNSTARRED;

        const style = styles.dropDownMenu;

        return (
            <DropDownMenu
                value={this.state.value}
                onChange={this.handleChange}
                labelStyle={Object.assign({}, style.defaultFontStyle, style.labelStyle)}
                listStyle={Object.assign({}, style.defaultFontStyle, style.listStyle)}
                iconStyle={style.iconStyle}
                selectedMenuItemStyle={Object.assign({}, style.defaultFontStyle, style.selectedMenuItemStyle)}
                style={style.style}
                underlineStyle={style.underlineStyle}
            >
                <MenuItem value={all} primaryText="All items"/>
                <MenuItem value={starred} primaryText="Starred"/>
                <MenuItem value={unstarred} primaryText="Unstarred"/>
            </DropDownMenu>
        );
    }
}

class OwnerMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.ownerFilter
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.ownerFilter
        });
    }

    handleChange(event, index, value) {
        console.log(this.state.value, value);

        if (value !== this.state.value) {
            this.setState({value});

            this.props.onClickOwnerFilter(value);
        }
    }

    render() {
        const all = fromReducers.fromDashboardsConfig.ownerFilterValues.ALL;
        const me = fromReducers.fromDashboardsConfig.ownerFilterValues.ME;
        const others = fromReducers.fromDashboardsConfig.ownerFilterValues.OTHERS;

        const style = styles.dropDownMenu;

        return (
            <DropDownMenu
                value={this.state.value}
                onChange={this.handleChange}
                labelStyle={Object.assign({}, style.defaultFontStyle, style.labelStyle)}
                listStyle={Object.assign({}, style.defaultFontStyle, style.listStyle)}
                iconStyle={style.iconStyle}
                selectedMenuItemStyle={Object.assign({}, style.defaultFontStyle, style.selectedMenuItemStyle)}
                style={style.style}
                underlineStyle={style.underlineStyle}
            >
                <MenuItem value={all} primaryText="All users"/>
                <MenuItem value={me} primaryText="Created by me"/>
                <MenuItem value={others} primaryText="Created by others"/>
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

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.sortFilterId
        });
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
        const style = styles.dropDownMenu;

        return (
            <DropDownMenu
                value={this.state.value}
                onChange={this.handleChange}
                labelStyle={Object.assign({}, style.defaultFontStyle, style.labelStyle)}
                listStyle={Object.assign({}, style.defaultFontStyle, style.listStyle)}
                iconStyle={style.iconStyle}
                selectedMenuItemStyle={Object.assign({}, style.defaultFontStyle, style.selectedMenuItemStyle)}
                style={style.style}
                underlineStyle={style.underlineStyle}
            >
                <MenuItem value={'NAME_ASC'} primaryText="Name (asc)" />
                <MenuItem value={'NAME_DESC'} primaryText="Name (desc)" />
                <MenuItem value={'ITEMS_ASC'} primaryText="Number of items (asc)" />
                <MenuItem value={'ITEMS_DESC'} primaryText="Number of items (desc)" />
                <MenuItem value={'CREATED_ASC'} primaryText="Created date (asc)" />
                <MenuItem value={'CREATED_DESC'} primaryText="Created date (desc)" />
            </DropDownMenu>
        );
    }
}

const ViewPanel = props => {
    const list = fromReducers.fromDashboardsConfig.viewFilterValues.LIST;
    const table = fromReducers.fromDashboardsConfig.viewFilterValues.TABLE;

    const { viewFilter } = props;

    const buttonColor = grey700;

    const _styles = {
        icon: {
            width: 24,
            height: 24
        }
    };

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
        <IconButton style={styles.iconButton} iconStyle={_styles.icon} onClick={onClick}>
            {buttonMap[viewFilter]}
        </IconButton>
    );
};

const HomeButton = ({ onClickHome }) => <Textlink text={'Home'} onClick={onClickHome} />;

const ManageButton = ({ onClickManage }) => <Textlink text={'Manage dashboards'} onClick={onClickManage} />;

const DashboardBar = props => (
    <Toolbar style={styles.toolbar}>
        <ToolbarGroup style={{position: 'relative', left: '-10px'}} firstChild={true}>
            <Iconbutton />
            <ToolbarSeparator style={styles.toolbarSeparator} />
            <HomeButton {...props} />
            <ToolbarSeparator style={Object.assign({}, styles.toolbarSeparator, styles.hiddenToolbarSeparator)} />
            <Textlink text={'Manage dashboards'} onClick={props.onClickManage} />
        </ToolbarGroup>
        <ToolbarGroup lastChild={true}>
            <FilterField {...props} />
            <ClearButton {...props} />
            <ShowMenu {...props} />
            <OwnerMenu {...props} />
            <SortMenu {...props} />
            <ViewPanel {...props} />
        </ToolbarGroup>
    </Toolbar>
);

export default DashboardBar;

