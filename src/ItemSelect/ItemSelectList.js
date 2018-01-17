import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import loglevel from 'loglevel';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';

import Button from 'd2-ui/lib/button/Button';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import { fromDashboards } from '../actions';
import { sGetSelectedDashboard } from '../reducers';
import { sGetSelectedId } from '../reducers/selected';
import { getYMax } from '../ItemGrid/gridUtil';
import { itemTypeMap } from '../util';

const getIcon = type => {
    switch (type) {
        case 'APPS':
            return 'ViewList'; // XXX change to something app
        case 'CHART':
        case 'EVENT_CHART':
            return 'InsertChart';
        case 'REPORT_TABLE':
        case 'EVENT_REPORT':
        case 'MAP':
            return 'Public';
        case 'RESOURCES':
            return 'ViewList'; // XXX change to something document
        case 'REPORTS':
            return 'ViewList';
        case 'USERS':
            return 'Person';
        default:
            return '';
    }
};

class ItemSelectList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            seeMore: false,
        };
    }

    getAppUrl = (type, id) => {
        let appName;
        let url;

        switch (type) {
            case 'APPS':
                url = '#';
                break;
            case 'CHART':
                appName = 'dhis-web-visualizer/';
                break;
            case 'EVENT_CHART':
                appName = 'dhis-web-event-visualizer/';
                break;
            case 'EVENT_REPORT':
                appName = 'dhis-web-event-reports/';
                break;
            case 'MAP':
                appName = 'dhis-web-mapping/';
                break;
            case 'REPORTS':
                url = `../dhis-web-reporting/getReportParams.action?mode=report&uid=${id}`;
                break;
            case 'REPORT_TABLE':
                appName = 'dhis-web-pivot/';
                break;
            case 'RESOURCES':
                url = `${this.context.d2.Api.getApi().baseUrl}/documents/${id}`;
                break;
            case 'USERS':
                appName = 'dhis-web-dashboard-integration/profile.action';
                break;
            default:
                appName = '';
                break;
        }

        if (!url && appName) {
            // TODO getBaseUrl() from manifest?!
            url = `../${appName}?id=${id}`;
        }

        return url;
    };

    addItem = item => () => {
        const { dashboardId, dashboardItems, acAddDashboardItem } = this.props;
        const yValue = getYMax(dashboardItems);

        if (
            itemTypeMap[this.props.type].propName.match(
                /(chart|reportTable|map|eventChart|eventReport)/
            )
        ) {
            acAddDashboardItem(dashboardId, yValue, {
                id: item.id,
                name: item.displayName || item.name,
                type: this.props.type,
            });

            // TODO toggle the popover is this ok here?
            this.props.onRequestAdd();
        } else {
            loglevel.warn(
                `${this.props.type} dashboard item type not supported yet`
            );
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
                                    icon={getIcon(this.props.type)}
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
                                        href={this.getAppUrl(
                                            this.props.type,
                                            item.id
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
        'APPS',
        'CHART',
        'EVENT_CHART',
        'EVENT_REPORT',
        'MAP',
        'REPORTS',
        'REPORT_TABLE',
        'RESOURCES',
        'USERS',
    ]).isRequired,
    title: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    onRequestAdd: PropTypes.func.isRequired,
    onChangeItemsLimit: PropTypes.func.isRequired,
    dashboardId: PropTypes.string.isRequired,
    dashboardItems: PropTypes.array.isRequired,
};

ItemSelectList.contextTypes = {
    d2: PropTypes.object.isRequired,
};

export default connect(
    state => {
        return {
            dashboardId: sGetSelectedId(state),
            dashboardItems: sGetSelectedDashboard(state).dashboardItems,
        };
    },
    {
        acAddDashboardItem: fromDashboards.acAddDashboardItem,
    }
)(ItemSelectList);
