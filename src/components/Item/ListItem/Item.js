import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, ListItem as MUIListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import Line from '../../../widgets/Line';
import {
    itemTypeMap,
    getItemUrl,
    getItemIcon,
} from '../../../modules/itemTypes';
import { orArray } from '../../../modules/util';
import { tRemoveListItemContent } from './actions';
import { colors } from '../../../modules/colors';
import ItemHeader from '../ItemHeader';

const getItemTitle = item => {
    return itemTypeMap[item.type].pluralTitle;
};

const getContentItems = item =>
    orArray(item[itemTypeMap[item.type].propName]).filter(
        (item, index, array) =>
            array.findIndex(el => el.id === item.id) === index
    );

const removeContent = (handler, item, contentToRemove) => () => {
    handler(item, contentToRemove);
};

const ListItem = (props, context) => {
    const { item, editMode, tRemoveListItemContent } = props;

    // avoid showing duplicates
    const contentItems = getContentItems(item);

    const primaryText = contentItem => {
        const deleteButton = (
            <IconButton
                style={{
                    verticalAlign: 'text-bottom',
                    padding: '0 12px',
                    height: 20,
                }}
                iconStyle={{
                    width: 20,
                    height: 20,
                    fill: colors.red,
                }}
                onClick={removeContent(
                    tRemoveListItemContent,
                    item,
                    contentItem
                )}
            >
                <DeleteIcon />
            </IconButton>
        );

        return (
            <div>
                <a
                    style={{ textDecoration: 'none' }}
                    href={getItemUrl(item.type, contentItem, context.d2)}
                >
                    {contentItem.name}
                </a>
                {editMode ? deleteButton : null}
            </div>
        );
    };

    const ItemIcon = getItemIcon(item.type);

    return (
        <Fragment>
            <ItemHeader title={getItemTitle(item)} />
            <Line />
            <List className="dashboard-item-content">
                {contentItems.map(contentItem => (
                    <MUIListItem
                        key={contentItem.id}
                        primaryText={primaryText(contentItem)}
                        leftIcon={<ItemIcon style={{ margin: 0 }} />}
                        disabled={true}
                        innerDivStyle={{ padding: '4px 4px 4px 32px' }}
                    />
                ))}
            </List>
        </Fragment>
    );
};

ListItem.contextTypes = {
    d2: PropTypes.object,
};

const ListItemContainer = connect(
    null,
    {
        tRemoveListItemContent,
    }
)(ListItem);

export default ListItemContainer;
