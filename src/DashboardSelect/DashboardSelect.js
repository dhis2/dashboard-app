import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { fromSelected } from '../actions';
import * as fromReducers from '../reducers';

import DashboardSelectList from './DashboardSelectList';
import DashboardSelectTable from './DashboardSelectTable';

const styles = {
    loading: {
        width: '100%',
        padding: '20px',
        textAlign: 'center',
        color: '#888',
        fontSize: '13px',
    },
};

function Loading() {
    return <div style={styles.loading}>{'Loading dashboards ...'}</div>;
}

// Component

export const DashboardSelect = ({ isFetching, dashboards, style, onClick }) => {
    if (isFetching) {
        return <Loading />;
    }

    const list = <DashboardSelectList {...{ dashboards, onClick }} />;
    const table = <DashboardSelectTable {...{ dashboards, onClick }} />;

    switch (style) {
        case 'LIST':
            return list;
        case 'TABLE':
            return table;
        default:
            return list;
    }
};

DashboardSelect.propTypes = {
    isFetching: PropTypes.bool,
    dashboards: PropTypes.array,
    style: PropTypes.string,
    onClick: PropTypes.func,
};

DashboardSelect.defaultProps = {
    isFetching: false,
    dashboards: [],
    style: 'LIST',
    onClick: Function.prototype,
};

// Container

// const mapStateToProps = state => ({
//     isFetching: fromReducers.fromDashboards.sGetFromState(state) === null,
//     dashboards: fromReducers.sGetFilteredDashboards(state),
//     style: fromReducers.fromStyle.sGetFromState(state),
// });

const mapStateToProps = state => {
    const isf = fromReducers.fromDashboards.sGetFromState(state);
    const dbs = fromReducers.sGetFilteredDashboards(state);
    const st = fromReducers.fromStyle.sGetFromState(state);

    console.log(isf);
    console.log(dbs);
    console.log(st);

    return {
        isFetching: fromReducers.fromDashboards.sGetFromState(state) === null,
        dashboards: fromReducers.sGetFilteredDashboards(state),
        style: fromReducers.fromStyle.sGetFromState(state),
    };
};

const mapDispatchToProps = dispatch => ({
    onClick: id => dispatch(fromSelected.tSetSelectedDashboardById(id)),
});

const DashboardSelectCt = connect(mapStateToProps, mapDispatchToProps)(
    DashboardSelect
);

export default DashboardSelectCt;
