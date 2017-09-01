import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './DashboardBar.css';

import { blue500, grey700 } from 'material-ui/styles/colors';

import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import IconHome from 'material-ui/svg-icons/action/home';
import IconSettings from 'material-ui/svg-icons/action/settings';
import IconAdd from 'material-ui/svg-icons/content/add-circle';
import IconClear from 'material-ui/svg-icons/content/clear';
import IconList from 'material-ui/svg-icons/action/list';
import ListViewModule from 'material-ui/svg-icons/action/view-module';

import isEmpty from 'd2-utilizr/lib/isEmpty';

import * as fromReducers from '../../reducers';

const styles = {
    icon: {
        width: 28,
        height: 28
    },
    iconButton: {
        width: 52,
        height: 52,
        padding: 0
    },
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
    textLink: {
        fontSize: '14px',
        fontWeight: 400,
        color: '#000',
        cursor: 'pointer'
    },
    textLinkHover: {
        color: '#666'
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
        paddingTop: '5px',
        paddingBottom: '5px'
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

class TextLink extends Component {
    constructor(props) {
        super(props);

        this.onMouseOverHandle = this.onMouseOverHandle.bind(this);
        this.onMouseOutHandle = this.onMouseOutHandle.bind(this);

        this.state = {
            color: styles.textLink.color
        };
    }

    onMouseOverHandle() {
        this.setState({
            color: styles.textLinkHover.color
        });
    }

    onMouseOutHandle() {
        this.setState({
            color: styles.textLink.color
        });
    }

    render() {
        const { text, onClick, isSelected, style } = this.props;

        return (
            <span
                style={Object.assign({}, styles.textLink, style, this.state)}
                onClick={onClick}
                onMouseOver={this.onMouseOverHandle}
                onMouseOut={this.onMouseOutHandle}
            >
                {text}
            </span>
        );
    }
}

const getLink = ({ text, onClick, style }) =>
    <TextLink
        text={text}
        onClick={onClick}
        style={Object.assign({}, styles.toolbarTextLink, style)} />;

const getToolbarLink = ({ text, onClick }) => getLink({ text, onClick });

// components

const NewButton = () => (
    <IconButton style={styles.iconButton} iconStyle={styles.icon}>
        <IconAdd color={blue500}/>
    </IconButton>
);

const HomeButton = ({ onClickHome }) => getToolbarLink({
    text: 'Home',
    onClick: onClickHome,
    style: {}
});

const ManageButton = ({ onClickManage }) => getToolbarLink({
    text: 'Manage dashboards',
    onClick: onClickManage,
    style: {}
});

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

const DashboardBar = props => (
    <Toolbar style={styles.toolbar}>
        <ToolbarGroup style={{position: 'relative', left: '-10px'}} firstChild={true}>
            <NewButton/>
            <ToolbarSeparator style={styles.toolbarSeparator} />
            <HomeButton {...props} />
            <ToolbarSeparator style={Object.assign({}, styles.toolbarSeparator, styles.hiddenToolbarSeparator)} />
            <ManageButton {...props} />
        </ToolbarGroup>
        <ToolbarGroup lastChild={true}>
            <FilterField {...props} />
            <ClearButton {...props} />
            <ShowMenu {...props} />
            <SortMenu {...props} />
            <ViewPanel {...props} />
        </ToolbarGroup>
    </Toolbar>
);

export default DashboardBar;