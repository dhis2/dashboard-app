import React, { Component } from 'react';

import './DashboardList.css';

import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';

import IconStar from 'material-ui/svg-icons/toggle/star';

import * as fromReducers from '../../reducers';

const linkColor = '#2264ff';
const linkColorHover = '#1b3f8f';

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
            fontWeight: 600
        }
    },
    tableView: {
        root: {
            margin: '10px 20px 20px'
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

// components

function Loading() {
    return (
        <div style={styles.loading}>
            {'Loading dashboards ...'}
        </div>
    );
}

function ListView({ dashboards, onClickDashboard, selectedId }) {
    const selectedStyle = Object.assign({}, styles.listView.liName, styles.listView.liNameSelected);

    const icon = {
        width: '13px',
        height: '13px',
        position: 'relative',
        top: '2px',
        paddingRight: '4px'
    };

    const s = {
        chip: {
            margin: 4
        },
        labelStyle: {
            fontSize: '13px',
            color: '#333',
            fontWeight: 500
        },
        wrapper: {
            display: 'flex',
            flexWrap: 'wrap'
        },
    };

    function handleTouchTap() {
        alert('You clicked the Chip.');
    }

    return (
        <div className="DashboardList">
            <div style={s.wrapper}>
                {dashboards.map(d => {
                    return (
                        <Chip
                            key={d.id}
                            onClick={handleTouchTap}
                            style={s.chip}
                            labelStyle={s.labelStyle}
                        >
                            {d.starred ? <Avatar color="#444" icon={<IconStar/>}/> : ''}
                            {d.name}
                        </Chip>
                    );
                })}
            </div>
        </div>
    );

    // return (
    //     <div className="DashboardList">
    //         <ul style={styles.listView.ul}>
    //             {dashboards.map(d => {
    //                 const style = d.id === selectedId ? selectedStyle : styles.listView.liName;
    //
    //                 return (
    //                     <li key={d.id} onClick={function () { onClickDashboard(d.id) }}>
    //                         <span>{d.starred ? <IconStar style={icon} /> : ''}</span><span style={style}>{d.name}</span><span>{' (' + d.numberOfItems + ')'}</span>
    //                     </li>
    //                 );
    //             })}
    //         </ul>
    //     </div>
    // );
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