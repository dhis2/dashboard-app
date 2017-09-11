import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

const linkColor = '#2264ff';
const linkColorHover = '#1b3f8f';

const styles = {
    listView: {
        ul: {
            paddingLeft: '15px'
        },
        li: {
            display: 'inline-block',
            margin: '1px',
            cursor: 'pointer',
            color: '#444',
            padding: '7px 11px',
            border: '1px solid #e1e1e1',
            borderRadius: '3px'
        },
        liName: {
            color: linkColor,
            fontSize: '13px',
            fontWeight: 500,
            paddingBottom: '3px'
        },
        liNameSelected: {
            color: linkColorHover,
            fontWeight: 600
        }
    },
    listItem: {
        backgroundColor: '#e0e0e0',
        backgroundColorHover: '#ccc'
    },
    tableRowColumnTextLink: {
        link: {
            color: linkColor,
            fontWeight: 'normal',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500
        },
        linkHover: {
            color: linkColorHover
        },
        linkSelected: {
            color: linkColorHover,
            fontWeight: 700
        }
    },
    tableView: {
        root: {
            marginTop: '5px',
            marginTop: '5px',
            marginLeft: '5px'
        },
        row: {
            height: '19px',
            padding: '4px',
            fontSize: '13px'
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
                    selectedStyle
                )}
                onMouseOver={this.onMouseOverHandle}
                onMouseOut={this.onMouseOutHandle}
                onClick={onClickDashboard}
            >
                {text}
            </TableRowColumn>
        );
    }
}

TableRowColumnTextLink.propTypes = {
    text: PropTypes.string,
    onClickDashboard: PropTypes.func,
    isSelected: PropTypes.bool,
    style: PropTypes.object,
};

export default class DashboardViewTable extends Component {

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

        const _style = styles.tableView;

        return (
            <div style={_style.root}>
                <Table onRowSelection={this.handleRowSelection}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow style={_style.row}>
                            <TableHeaderColumn style={Object.assign({}, _style.row, _style.starred)}>Starred</TableHeaderColumn>
                            <TableHeaderColumn style={Object.assign({}, _style.row, _style.name)}>Name</TableHeaderColumn>
                            <TableHeaderColumn style={_style.row}>Items</TableHeaderColumn>
                            <TableHeaderColumn style={_style.row}>Owner</TableHeaderColumn>
                            <TableHeaderColumn style={_style.row}>Created</TableHeaderColumn>
                            <TableHeaderColumn style={_style.row}>Modified</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {dashboards.map(d => (
                            <TableRow key={d.id} style={_style.row}>
                                <TableRowColumn style={Object.assign({}, _style.row, _style.rowColumn, _style.starred)}>{'' + !!d.starred}</TableRowColumn>
                                <TableRowColumnTextLink text={d.name} onClickDashboard={() => onClickDashboard(d.id)} isSelected={d.id === selectedId} />
                                <TableRowColumn style={Object.assign({}, _style.row, _style.rowColumn)}>{d.numberOfItems}</TableRowColumn>
                                <TableRowColumn style={Object.assign({}, _style.row, _style.rowColumn)}>{'janhov'}</TableRowColumn>
                                <TableRowColumn style={Object.assign({}, _style.row, _style.rowColumn)}>{d.created}</TableRowColumn>
                                <TableRowColumn style={Object.assign({}, _style.row, _style.rowColumn)}>{d.lastModified}</TableRowColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }
}

DashboardViewTable.propTypes = {
    dashboards: PropTypes.array,
    selectedId: PropTypes.string,
    onClickDashboard: PropTypes.func,
};