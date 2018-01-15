// This component will be removed. Some of the code should be reused in dashboards List view mode.

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { grey700 } from 'material-ui/styles/colors';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';
import IconList from 'material-ui/svg-icons/action/list';
import ListViewModule from 'material-ui/svg-icons/action/view-module';

import './DashboardBar.css';

import D2TextLink from '../widgets/D2TextLink';
import D2IconButton from '../widgets/D2IconButton';
import D2Dropdown from '../widgets/D2Dropdown';

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
    hiddenToolbarSeparator: {
        backgroundColor: 'transparent',
    },
};

// Component

const getViewFilterIcon = viewFilter => {
    const list = 'LIST';
    const table = 'TABLE';
    const buttonColor = grey700;

    const buttonMap = {
        [list]: <IconList color={buttonColor} />,
        [table]: <ListViewModule color={buttonColor} />,
    };

    return buttonMap[viewFilter];
};

const onClickViewFilterWrapper = (viewFilter, onClickViewFilter) => {
    const list = 'LIST';
    const table = 'TABLE';

    const onClickViewFilterParamMap = {
        [list]: table,
        [table]: list,
    };

    return () => onClickViewFilter(onClickViewFilterParamMap[viewFilter]);
};

export const Dashboardbar = props => (
    <Toolbar style={styles.toolbar}>
        <ToolbarGroup
            style={{ position: 'relative', left: '-10px' }}
            firstChild
        >
            <D2IconButton />
            <ToolbarSeparator style={styles.toolbarSeparator} />
            <D2TextLink text="Home" onClick={props.onClickHome} />
            <ToolbarSeparator
                style={Object.assign(
                    {},
                    styles.toolbarSeparator,
                    styles.hiddenToolbarSeparator
                )}
            />
            <D2TextLink
                text="Manage dashboards"
                onClick={props.onClickManage}
            />
        </ToolbarGroup>
        <ToolbarGroup lastChild>
            <D2Dropdown
                value={props.ownerFilter}
                onClick={props.onClickOwnerFilter}
                data={fromReducers.fromFilter.ownerData}
            />
            <D2Dropdown
                value={props.orderFilter}
                onClick={props.onClickOrderFilter}
                data={fromReducers.fromFilter.orderData}
            />
            <D2IconButton
                icon={getViewFilterIcon(props.style)}
                iconStyle={{ width: 24, height: 24 }}
                onClick={onClickViewFilterWrapper(
                    props.style,
                    props.onClickStyle
                )}
            />
        </ToolbarGroup>
    </Toolbar>
);

Dashboardbar.propTypes = {
    onClickHome: PropTypes.func,
    onClickManage: PropTypes.func,
    onClickOwnerFilter: PropTypes.func,
    onClickOrderFilter: PropTypes.func,
    onClickStyle: PropTypes.func,
    ownerFilter: PropTypes.string,
    orderFilter: PropTypes.string,
    style: PropTypes.string,
};

Dashboardbar.defaultProps = {
    onClickHome: Function.prototype,
    onClickManage: Function.prototype,
    onClickOwnerFilter: Function.prototype,
    onClickOrderFilter: Function.prototype,
    onClickStyle: Function.prototype,
    ownerFilter: null,
    orderFilter: null,
    style: 'LIST',
};

// Container

const mapStateToProps = state => ({
    textFilter: fromReducers.fromFilter.sGetName(state),
    ownerFilter: fromReducers.fromFilter.sGetOwner(state),
    orderFilter: fromReducers.fromFilter.sGetOrder(state),
    //viewFilter: fromReducers.fromFilter.sGetStyle(state),
});

const mapDispatchToProps = dispatch => ({
    onChangeFilterName: value => dispatch(fromActions.acSetFilterName(value)),
    onClickFilterOwner: value => dispatch(fromActions.acSetFilterOwner(value)),
    onClickFilterOrder: value => dispatch(fromActions.acSetFilterOrder(value)),
    //onClickViewFilter: value => dispatch(fromActions.acSetDashboardsConfigViewFilter(value)),
    onClickHome: () => dispatch(fromActions.tSetPresetHome()),
    onClickManage: () => dispatch(fromActions.tSetPresetManage()),
});

const DashboardbarCt = connect(mapStateToProps, mapDispatchToProps)(
    Dashboardbar
);

export default DashboardbarCt;
