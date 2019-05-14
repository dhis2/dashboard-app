import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { MenuItem, Divider, colors } from '@dhis2/ui-core';
import LaunchIcon from '../../icons/Launch';

import { tAddListItemContent } from './actions';
import { acAddDashboardItem } from '../../actions/editDashboard';
import { sGetEditDashboardRoot } from '../../reducers/editDashboard';
import {
    getItemUrl,
    getItemIcon,
    listItemTypes,
    APP,
} from '../../modules/itemTypes';

import classes from './styles/MenuItem.module.css';

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
                <MenuItem
                    dense
                    disabled
                    key={this.props.title}
                    label={
                        <p style={{ color: colors.grey800, fontWeight: '600' }}>
                            {this.props.title}
                        </p>
                    }
                />
                {this.props.items.map(item => {
                    const ItemIcon = getItemIcon(this.props.type);
                    const itemUrl = getItemUrl(
                        this.props.type,
                        item,
                        this.context.d2
                    );

                    return (
                        <MenuItem // apps don't have item.id
                            dense
                            key={item.id || item.key}
                            label={
                                <div className={classes.menuItem}>
                                    <div className={classes.itemTitle}>
                                        <ItemIcon
                                            style={{
                                                marginRight: '6px',
                                                fill: colors.grey600,
                                            }}
                                        />
                                        <span>
                                            {item.displayName || item.name}
                                        </span>
                                        {itemUrl && (
                                            <a
                                                className={classes.launchLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href={itemUrl}
                                            >
                                                <LaunchIcon />
                                            </a>
                                        )}
                                    </div>
                                    <button
                                        className={classes.buttonInsert}
                                        onClick={this.addItem(item)}
                                    >
                                        {i18n.t('Insert')}
                                    </button>
                                </div>
                            }
                        />
                    );
                })}
                <MenuItem
                    dense
                    key={`showmore${this.props.title}`}
                    onClick={this.toggleSeeMore}
                    label={
                        <button className={classes.showMoreButton}>
                            {this.state.seeMore
                                ? i18n.t('Show fewer')
                                : i18n.t('Show more')}
                        </button>
                    }
                />
                <Divider margin="8px 0px" />
            </Fragment>
        );
    }
}

ItemSelectList.propTypes = {
    type: PropTypes.oneOf(listItemTypes).isRequired,
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
