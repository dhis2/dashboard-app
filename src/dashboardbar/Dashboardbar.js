import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { blue500, grey700 } from 'material-ui/styles/colors';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import IconClear from 'material-ui/svg-icons/content/clear';
import IconList from 'material-ui/svg-icons/action/list';
import ListViewModule from 'material-ui/svg-icons/action/view-module';

import isEmpty from 'd2-utilizr/lib/isEmpty';

import './Dashboardbar.css';

import Textlink from '../widgets/Textlink';
import Iconbutton from '../widgets/Iconbutton';
import Dropdown from '../widgets/Dropdown';

import * as fromReducers from '../reducers';
import * as fromActions from '../actions';

const styles = {
    filterField: {
        fontSize: '14px',
        width: '200px',
    },
    filterFieldInput2: {
        top: '4px',
    },
    filterFieldHint2: {
        top: '10px',
    },
    filterFieldUnderline: {
        bottom: '11px',
    },
    filterFieldUnderlineFocus: {
        borderColor: '#aaa',
        borderWidth: '1px',
    },
    clearButton: {
        width: '24px',
        height: '24px',
        padding: 0,
        left: '-22px',
    },
    clearButtonIcon: {
        width: '16px',
        height: '16px',
    },
    dropDownMenu: {
        defaultFontStyle: {
            color: '#222',
            fontSize: '14px',
        },
        labelStyle: {
            position: 'relative',
            top: '-2px',
        },
        listStyle: {
            padding: '10px 0 !important',
        },
        iconStyle: {
            top: '2px',
        },
        selectedMenuItemStyle: {
            fontWeight: 500,
        },
        underlineStyle: {
            border: '0 none',
        },
        style: {
            height: '52px',
        },
    },
    toolbar: {
        height: 52,
        backgroundColor: '#fff',
        paddingTop: '10px',
        paddingBottom: '8px',
    },
    toolbarSeparator: {
        height: '26px',
        marginRight: '20px',
        marginLeft: '5px',
    },
    toolbarTextLink: {
        whiteSpace: 'nowrap',
    },
    hiddenToolbarSeparator: {
        backgroundColor: 'transparent',
    },
};

// Component

class FilterField extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: fromReducers.fromDashboardsConfig.DEFAULT_DASHBOARDSCONFIG_TEXTFILTER,
        };

        this.setFilterValue = this.setFilterValue.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.textFilter,
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

FilterField.propTypes = {
    textFilter: PropTypes.string,
    onChangeTextFilter: PropTypes.func,
};

FilterField.defaultProps = {
    textFilter: '',
    onChangeTextFilter: Function.prototype,
};

const ClearButton = ({ onChangeTextFilter, textFilter }) => {
    const disabled = isEmpty(textFilter);

    return (
        <IconButton
            style={Object.assign({}, styles.clearButton, { opacity: disabled ? 0 : 1 })}
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
    textFilter: PropTypes.string.isRequired,
};

const ViewPanel = (props) => {
    const list = fromReducers.fromDashboardsConfig.viewFilterData.LIST;
    const table = fromReducers.fromDashboardsConfig.viewFilterData.TABLE;

    const { viewFilter } = props;

    const buttonColor = grey700;

    const _styles = {
        icon: {
            width: 24,
            height: 24,
        },
    };

    const onClickViewFilterParamMap = {
        [list]: table,
        [table]: list,
    };

    function onClick() {
        props.onClickViewFilter(onClickViewFilterParamMap[viewFilter]);
    }

    const buttonMap = {
        [list]: <IconList color={buttonColor} />,
        [table]: <ListViewModule color={buttonColor} />,
    };

    return (
        <IconButton style={styles.iconButton} iconStyle={_styles.icon} onClick={onClick}>
            {buttonMap[viewFilter]}
        </IconButton>
    );
};

export const Dashboardbar = props => (
    <Toolbar style={styles.toolbar}>
        <ToolbarGroup style={{ position: 'relative', left: '-10px' }} firstChild>
            <Iconbutton />
            <ToolbarSeparator style={styles.toolbarSeparator} />
            <Textlink text={'Home'} onClick={props.onClickHome} />
            <ToolbarSeparator style={Object.assign({}, styles.toolbarSeparator, styles.hiddenToolbarSeparator)} />
            <Textlink text={'Manage dashboards'} onClick={props.onClickManage} />
        </ToolbarGroup>
        <ToolbarGroup lastChild>
            <FilterField {...props} />
            <ClearButton {...props} />
            <Dropdown value={props.showFilter} onClick={props.onClickShowFilter} data={fromReducers.fromDashboardsConfig.showFilterData} />
            <Dropdown value={props.ownerFilter} onClick={props.onClickOwnerFilter} data={fromReducers.fromDashboardsConfig.ownerFilterData} />
            <Dropdown value={props.sortFilterId} onClick={props.onClickSortFilter} data={fromReducers.fromDashboardsConfig.sortFilterValues} />
            <ViewPanel {...props} />
        </ToolbarGroup>
    </Toolbar>
);

Dashboardbar.propTypes = {
    onClickHome: PropTypes.func,
    onClickManage: PropTypes.func,
    onClickShowFilter: PropTypes.func,
    onClickOwnerFilter: PropTypes.func,
    onClickSortFilter: PropTypes.func,
    showFilter: PropTypes.func,
    ownerFilter: PropTypes.func,
    sortFilterId: PropTypes.func,
};

Dashboardbar.defaultProps = {
    onClickHome: Function.prototype,
    onClickManage: Function.prototype,
    onClickShowFilter: Function.prototype,
    onClickOwnerFilter: Function.prototype,
    onClickSortFilter: Function.prototype,
    showFilter: null,
    ownerFilter: null,
    sortFilterId: null,
};

// Container

const mapStateToProps = state => ({
    textFilter: fromReducers.fromDashboardsConfig.sGetTextFilterFromState(state),
    showFilter: fromReducers.fromDashboardsConfig.sGetShowFilterFromState(state),
    ownerFilter: fromReducers.fromDashboardsConfig.sGetOwnerFilterFromState(state),
    sortFilterId: fromReducers.fromDashboardsConfig.sGetSortFilterId(state),
    viewFilter: fromReducers.fromDashboardsConfig.sGetViewFilterFromState(state),
});

const mapDispatchToProps = dispatch => ({
    onChangeTextFilter: value => dispatch(fromActions.acSetDashboardsConfigTextFilter(value)),
    onClickShowFilter: value => dispatch(fromActions.acSetDashboardsConfigShowFilter(value)),
    onClickOwnerFilter: value => dispatch(fromActions.acSetDashboardsConfigOwnerFilter(value)),
    onClickSortFilterKey: value => dispatch(fromActions.acSetDashboardsConfigSortFilterKey(value)),
    onClickSortFilterDirection: value => dispatch(fromActions.acSetDashboardsConfigSortFilterDirection(value)),
    onClickViewFilter: value => dispatch(fromActions.acSetDashboardsConfigViewFilter(value)),
    onClickHome: () => dispatch(fromActions.tSetPresetHome()),
    onClickManage: () => dispatch(fromActions.tSetPresetManage()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboardbar);
