import React, { Component } from 'react';

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

// components

function Loading() {
    return (
        <div style={styles.loading}>
            {'Loading dashboards ...'}
        </div>
    );
}

const ListItem = ({ dashboard, onClick }) => {
    const _styles = {
        chip: {
            margin: 3,
            height: '30px',
            cursor: 'pointer'
        },
        labelStyle: {
            fontSize: '13px',
            color: '#333',
            fontWeight: 500,
            lineHeight: '30px'
        }
    };

    return (
        <Chip
            onClick={onClick}
            style={_styles.chip}
            labelStyle={_styles.labelStyle}
        >
            {dashboard.starred ? <Avatar color="#444" style={{height: '30px', width: '30px'}} icon={<IconStar/>}/> : ''}
            {dashboard.name}
        </Chip>
    );
}

//
// <Avatar size={20} style={{
//     position: 'relative',
//     left: '6px',
//     marginLeft: '6px',
//     color: '#444',
//     fontSize: '13px',
//     fontWeight: 700,
//     backgroundColor: '#ccc',
//     borderRadius: '50%',
//     padding: '1px'
// }}>{dashboard.numberOfItems}</Avatar>

function ListView({ dashboards, onClickDashboard, selectedId }) {

    const icon = {
        width: '13px',
        height: '13px',
        position: 'relative',
        top: '2px',
        paddingRight: '4px'
    };

    const wrapper = {
        display: 'flex',
        flexWrap: 'wrap'
    };

    return (
        <div className="DashboardList">
            <div style={wrapper}>
                {dashboards.map(d => {
                    return (
                        <ListItem key={d.id} dashboard={d} onClick={() => onClickDashboard(d.id)} />
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