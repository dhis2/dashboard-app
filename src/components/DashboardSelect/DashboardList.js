import React, { Component } from 'react';

import './DashboardList.css';

import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

import * as fromReducers from '../../reducers';

// components

function Loading() {
    const styles = {
        loading: {
            width: '100%',
            padding: '20px',
            textAlign: 'center',
            color: '#888',
            fontSize: '13px'
        }
    };

    return (
        <div style={styles.loading}>
            {'Loading dashboards ...'}
        </div>
    );
}

function ListView({ dashboards, onClickDashboard, dashboardsIsFetching }) {
    return (
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
}

class TableView extends Component {
    state = {
        selected: [1]
    };

    handleRowSelection = selectedRows => {
        this.setState({
            selected: selectedRows
        });
    };

    isSelected = index => {
        return this.state.selected.indexOf(index) !== -1;
    };

    render() {
        const { dashboards } = this.props;

        const date = (new Date()).toJSON().replace('T', ' ').substr(0,19);

        const styles = {
            div: {
                margin: '20px'
            },
            row: {
                height: '21px',
                padding: '2px',
                borderColor: '#eee'
            },
            starred: {
                width: '70px'
            },
            name: {
                width: '400px'
            }
        };

        return (
            <div style={styles.div}>
                <Table onRowSelection={this.handleRowSelection}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow style={styles.row}>
                            <TableHeaderColumn style={Object.assign({}, styles.row, styles.starred)}>Starred</TableHeaderColumn>
                            <TableHeaderColumn style={Object.assign({}, styles.row, styles.name)}>Name</TableHeaderColumn>
                            <TableHeaderColumn style={styles.row}>Items</TableHeaderColumn>
                            <TableHeaderColumn style={styles.row}>Owner</TableHeaderColumn>
                            <TableHeaderColumn style={styles.row}>Created</TableHeaderColumn>
                            <TableHeaderColumn style={styles.row}>Modified</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {dashboards.map(d => (
                            <TableRow key={d.id} style={styles.row}>
                                <TableRowColumn style={Object.assign({}, styles.row, styles.starred)}>{'' + !!d.starred}</TableRowColumn>
                                <TableRowColumn style={Object.assign({}, styles.row, styles.name)}>{d.name}</TableRowColumn>
                                <TableRowColumn style={styles.row}>{d.numberOfItems}</TableRowColumn>
                                <TableRowColumn style={styles.row}>{'janhov'}</TableRowColumn>
                                <TableRowColumn style={styles.row}>{date}</TableRowColumn>
                                <TableRowColumn style={styles.row}>{date}</TableRowColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }
}

function DashboardList(props) {
    const { dashboardsIsFetching, viewFilter } = props;

    if (dashboardsIsFetching) {
        return <Loading/>;
    }

    switch (viewFilter) {
        case fromReducers.fromDashboardsConfig.viewFilterValues.LIST:
            return <ListView {...props} />;

        case fromReducers.fromDashboardsConfig.viewFilterValues.TABLE:
            return <TableView {...props} />;

        default:
            return <ListView {...props} />;
    }
};

export default DashboardList;