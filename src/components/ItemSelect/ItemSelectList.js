import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18n from 'd2-i18n';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';
import Button from 'd2-ui/lib/button/Button';
import LaunchIcon from '@material-ui/icons/Launch';
import { tAddListItemContent } from './actions';
import { acAddDashboardItem } from '../../actions/editDashboard';
import { sGetEditDashboardRoot } from '../../reducers/editDashboard';
import {
    getItemUrl,
    getItemIcon,
    APP,
    CHART,
    EVENT_CHART,
    REPORT_TABLE,
    EVENT_REPORT,
    MAP,
    REPORTS,
    RESOURCES,
    USERS,
} from '../../modules/itemTypes';
import { colors } from '../../modules/colors';

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
            acAddDashboardItem,
            tAddListItemContent,
        } = this.props;

        const newItem = {
            id: item.id,
            name: item.displayName || item.name,
        };

        // special handling for ListItem types
        if (type.match(/(REPORTS|RESOURCES|USERS)/)) {
            tAddListItemContent(dashboardId, type, newItem);
        } else if (type === APP) {
            acAddDashboardItem({ type, content: item.key });
        } else {
            acAddDashboardItem({ type, content: newItem });
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
                        {`${i18n.t('See')} ${
                            this.state.seeMore
                                ? i18n.t('fewer')
                                : i18n.t('more')
                        } ${this.props.title}`}
                    </Button>
                </div>
                <Divider />
                <List>
                    {this.props.items.map(item => {
                        const itemUrl = getItemUrl(
                            this.props.type,
                            item,
                            this.context.d2
                        );

                        const ItemIcon = getItemIcon(this.props.type);

                        return (
                            <ListItem // apps don't have item.id
                                key={item.id || item.key}
                                leftIcon={
                                    <ItemIcon
                                        style={{
                                            margin: '6px',
                                            fill: colors.muiDefaultGrey,
                                        }}
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
                                            style={{
                                                marginLeft: '5px',
                                                marginRight: '5px',
                                            }}
                                        >
                                            + ADD
                                        </Button>
                                        {itemUrl && (
                                            <a
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href={itemUrl}
                                                style={{ display: 'flex' }}
                                            >
                                                <LaunchIcon
                                                    style={{
                                                        width: '16px',
                                                        height: '16px',
                                                        fill:
                                                            colors.muiDefaultGrey,
                                                    }}
                                                />
                                            </a>
                                        )}
                                    </p>
                                }
                            />
                        );
                    })}
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
        dashboardId: sGetEditDashboardRoot(state).id,
    }),
    {
        acAddDashboardItem,
        tAddListItemContent,
    }
)(ItemSelectList);
