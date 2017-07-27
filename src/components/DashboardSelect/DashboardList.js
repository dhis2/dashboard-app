import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

import './DashboardList.css';

import * as fromReducers from '../../reducers';

const Loading = () => (
    <div style={{
        width: '100%',
        padding: '20px',
        textAlign: 'center',
        color: '#888',
        fontSize: '13px'
    }}>
        {'Loading dashboards ...'}
    </div>
);

const ListView = ({ dashboards, onClickDashboard, dashboardsIsFetching }) => (
    <div className="DashboardList">
        <ul>
            {dashboards.map(d =>
                <li key={d.id} onClick={() => onClickDashboard(d.id)}>
                    <div className="name">{d.name}</div>
                    <div>{d.numberOfItems + ' items'}</div>
                </li>)}
        </ul>
    </div>
);

class TableView extends Component {
    state = {
        selected: [1],
    };

    handleRowSelection = selectedRows => {
        this.setState({
            selected: selectedRows,
        });
    };

    isSelected = index => {
        return this.state.selected.indexOf(index) !== -1;
    };

    render() {
        return (
            <Table onRowSelection={this.handleRowSelection}>
                <TableHeader>
                    <TableRow>
                        <TableHeaderColumn>ID</TableHeaderColumn>
                        <TableHeaderColumn>Name</TableHeaderColumn>
                        <TableHeaderColumn>Status</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow selected={this.isSelected(0)}>
                        <TableRowColumn>1</TableRowColumn>
                        <TableRowColumn>John Smith</TableRowColumn>
                        <TableRowColumn>Employed</TableRowColumn>
                    </TableRow>
                    <TableRow selected={this.isSelected(1)}>
                        <TableRowColumn>2</TableRowColumn>
                        <TableRowColumn>Randal White</TableRowColumn>
                        <TableRowColumn>Unemployed</TableRowColumn>
                    </TableRow>
                    <TableRow selected={this.isSelected(2)}>
                        <TableRowColumn>3</TableRowColumn>
                        <TableRowColumn>Stephanie Sanders</TableRowColumn>
                        <TableRowColumn>Employed</TableRowColumn>
                    </TableRow>
                    <TableRow selected={this.isSelected(3)}>
                        <TableRowColumn>4</TableRowColumn>
                        <TableRowColumn>Steve Brown</TableRowColumn>
                        <TableRowColumn>Employed</TableRowColumn>
                    </TableRow>
                </TableBody>
            </Table>
        );
    }
}

const DashboardList = props => {
    const { dashboardsIsFetching, viewFilter } = props;

    if (dashboardsIsFetching) {
        return <Loading/>;
    }

    switch (viewFilter) {
        case fromReducers.fromDashboardsConfig.viewFilterValues.LIST:
            return <ListView {...props} />;

        case fromReducers.fromDashboardsConfig.viewFilterValues.TABLE:
            return <TableView />;

        default:
            return <ListView {...props} />;
    }
};

DashboardList.propTypes = {
    dashboards: PropTypes.array,
    onClickDashboard: PropTypes.func,
    isFetching: PropTypes.bool
};

export default DashboardList;