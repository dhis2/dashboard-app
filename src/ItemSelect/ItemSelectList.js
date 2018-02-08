import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';

import Button from 'd2-ui/lib/button/Button';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import { acAddDashboardItem } from '../actions/editDashboard';
import { tAddListItemContent } from './actions';
import { sGetEditDashboard } from '../reducers/editDashboard';
import { getYMax } from '../ItemGrid/gridUtil';
import {
    itemTypeMap,
    APP,
    CHART,
    EVENT_CHART,
    REPORT_TABLE,
    EVENT_REPORT,
    MAP,
    REPORTS,
    RESOURCES,
    USERS,
} from '../itemTypes';
import { getItemUrl } from '../util';

class ItemSelectList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            seeMore: false,
        };
    }

    addItem = item => () => {
        const {
            type,
            dashboardId,
            dashboardItems,
            acAddDashboardItem,
            tAddListItemContent,
        } = this.props;
        const yValue = getYMax(dashboardItems);

        const newItem = {
            id: item.id,
            name: item.displayName || item.name,
        };

        // special handling for ListItem types
        if (type.match(/(REPORTS|RESOURCES|USERS)/)) {
            tAddListItemContent(dashboardId, type, newItem);
        } else if (type === APP) {
            newItem.id = newItem.appKey = item.key;

            acAddDashboardItem({ type, content: newItem }, yValue);
        } else {
            acAddDashboardItem({ type, content: newItem }, yValue);
        }
    };

    toggleSeeMore = () => {
        this.setState({ seeMore: !this.state.seeMore });

        this.props.onChangeItemsLimit(this.props.type);
    };

    render() {
        return (
            <Fragment>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingLeft: '16px',
                    }}
                >
                    <h3>{this.props.title}</h3>
                    <Button
                        color="primary"
                        style={{ textTransform: 'uppercase' }}
                        onClick={this.toggleSeeMore}
                    >
                        {`See ${this.state.seeMore ? 'fewer' : 'more'} ${
                            this.props.title
                        }`}
                    </Button>
                </div>
                <Divider />
                <List>
                    {this.props.items.map(item => (
                        <ListItem
                            // apps don't have item.id
                            key={item.id || item.key}
                            leftIcon={
                                <SvgIcon
                                    icon={itemTypeMap[this.props.type].icon}
                                    style={{ margin: '6px' }}
                                />
                            }
                            innerDivStyle={{ padding: '0px 0px 0px 42px' }}
                            hoverColor="transparent"
                            primaryText={
                                <p
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        margin: 0,
                                    }}
                                >
                                    {item.displayName || item.name}
                                    <Button
                                        color="primary"
                                        onClick={this.addItem(item)}
                                    >
                                        + ADD
                                    </Button>
                                    <a
                                        href={getItemUrl(
                                            this.props.type,
                                            item.id,
                                            this.context.d2
                                        )}
                                        style={{ display: 'flex' }}
                                    >
                                        <SvgIcon
                                            icon="Launch"
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                            }}
                                        />
                                    </a>
                                </p>
                            }
                        />
                    ))}
                </List>
            </Fragment>
        );
    }
}

ItemSelectList.propTypes = {
    type: PropTypes.oneOf([
        APP,
        CHART,
        EVENT_CHART,
        REPORT_TABLE,
        EVENT_REPORT,
        MAP,
        REPORTS,
        RESOURCES,
        USERS,
    ]).isRequired,
    title: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    onChangeItemsLimit: PropTypes.func.isRequired,
};

ItemSelectList.contextTypes = {
    d2: PropTypes.object.isRequired,
};

export default connect(
    state => ({
        dashboardId: sGetEditDashboard(state).id,
        dashboardItems: sGetEditDashboard(state).dashboardItems,
    }),
    {
        acAddDashboardItem,
        tAddListItemContent,
    }
)(ItemSelectList);
