import React, { Component } from 'react';

import './DashboardList.css';

import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

import * as fromReducers from '../../reducers';

const styles = {
    loading: {
        width: '100%',
        padding: '20px',
        textAlign: 'center',
        color: '#888',
        fontSize: '13px'
    },
    listView: {
        ul: {
            textAlign: 'center',
            paddingLeft: '15px'
        },
        li: {
            display: 'inline-block',
            margin: '1px',
            cursor: 'pointer',
            color: '#444',
            padding: '6px 11px',
            border: '1px solid #e1e1e1',
            borderRadius: '3px'
        },
        liName: {
            color: '#2264ff',
            fontSize: '13px',
            fontWeight: 500,
            paddingBottom: '3px'
        }
    },
    tableRowColumnTextLink: {
        link: {
            color: '#2264ff',
            fontWeight: 'normal',
            cursor: 'pointer'
        },
        linkHover: {
            color: '#193874'
        },
        linkSelected: {
            color: '#215DEA',
            fontWeight: 600
        }
    },
    tableView: {
        root: {
            margin: '20px'
        },
        row: {
            height: '19px',
            padding: '2px',
            fontSize: '11px'
        },
        rowColumn: {
            color: '#000',
            fontSize: '11px'
        },
        starred: {
            width: '70px'
        },
        name: {
            width: '400px'
        }
    }
};

// components

function Loading() {
    return (
        <div style={styles.loading}>
            {'Loading dashboards ...'}
        </div>
    );
}

function ListView({ dashboards, onClickDashboard, dashboardsIsFetching }) {
    return (
        <div className="DashboardList">
            <ul style={styles.listView.ul}>
                {dashboards.map(d =>
                    <li key={d.id} onClick={() => onClickDashboard(d.id)}>
                        <div style={styles.listView.liName}>{d.name}</div>
                        <div>{d.numberOfItems + ' items'}</div>
                    </li>
                )}
            </ul>
        </div>
    );
}

class TableRowColumnTextLink extends Component {

    styles = styles.tableRowColumnTextLink;

    state = {
        color: this.styles.link.color
    };

    constructor(props) {
        super(props);

        this.onMouseOverHandle = this.onMouseOverHandle.bind(this);
        this.onMouseOutHandle = this.onMouseOutHandle.bind(this);

        this.state = {
            color: this.styles.link.color
        };
    }

    onMouseOverHandle(event) {
        event.preventDefault();

        this.setState({
            color: this.styles.linkHover.color
        });
    }

    onMouseOutHandle(event) {
        event.preventDefault();

        this.setState({
            color: this.styles.link.color
        });
    }

    render() {
        const { text, onClickDashboard, isSelected, style } = this.props;
        const selectedStyle = isSelected ? this.styles.linkSelected : null;

        return (
            <TableRowColumn
                style={Object.assign({},
                    styles.tableView.row,
                    styles.tableView.rowColumn,
                    this.styles.link,
                    styles.tableView.name,
                    style,
                    this.state,
                    selectedStyle)}
                onMouseOver={this.onMouseOverHandle}
                onMouseOut={this.onMouseOutHandle}
                onClick={onClickDashboard}
            >
                {text}
            </TableRowColumn>
        );
    }
}

class TableView extends Component {

    styles = styles.tableView;

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
        const { dashboards, onClickDashboard, selectedId } = this.props;

        const styles = this.styles;

        return (
            <div style={styles.root}>
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
                                <TableRowColumn style={Object.assign({}, styles.row, styles.rowColumn, styles.starred)}>{'' + !!d.starred}</TableRowColumn>
                                <TableRowColumnTextLink text={d.name} onClickDashboard={() => onClickDashboard(d.id)} isSelected={d.id === selectedId} />
                                <TableRowColumn style={Object.assign({}, styles.row, styles.rowColumn)}>{d.numberOfItems}</TableRowColumn>
                                <TableRowColumn style={Object.assign({}, styles.row, styles.rowColumn)}>{'janhov'}</TableRowColumn>
                                <TableRowColumn style={Object.assign({}, styles.row, styles.rowColumn)}>{d.created}</TableRowColumn>
                                <TableRowColumn style={Object.assign({}, styles.row, styles.rowColumn)}>{d.lastModified}</TableRowColumn>
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