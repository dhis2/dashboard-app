import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { colors } from '@dhis2/ui-core';

import DeleteIcon from '../../../icons/Delete';
import Line from '../../../widgets/Line';
import {
    itemTypeMap,
    getItemUrl,
    getItemIcon,
} from '../../../modules/itemTypes';
import { orArray } from '../../../modules/util';
import { tRemoveListItemContent } from './actions';
import ItemHeader from '../ItemHeader';
import classes from './Item.module.css';

const getItemTitle = item => itemTypeMap[item.type].pluralTitle;

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
    const contentItems = getContentItems(item);

    const getLink = contentItem => {
        const deleteButton = (
            <button
                className={classes.deletebutton}
                onClick={removeContent(
                    tRemoveListItemContent,
                    item,
                    contentItem
                )}
            >
                <DeleteIcon className={classes.deleteicon} />
            </button>
        );

        return (
            <Fragment>
                <a
                    className={classes.link}
                    style={{ color: colors.grey900 }}
                    href={getItemUrl(item.type, contentItem, context.d2)}
                >
                    {contentItem.name}
                </a>
                {editMode ? deleteButton : null}
            </Fragment>
        );
    };

    const ItemIcon = getItemIcon(item.type);

    return (
        <Fragment>
            <ItemHeader title={getItemTitle(item)} />
            <Line />
            <div className="dashboard-item-content">
                <ul className={classes.list}>
                    {contentItems.map(contentItem => (
                        <li className={classes.item} key={contentItem.id}>
                            <ItemIcon className={classes.itemicon} />
                            {getLink(contentItem)}
                        </li>
                    ))}
                </ul>
            </div>
        </Fragment>
    );
};

ListItem.contextTypes = {
    d2: PropTypes.object,
};

export default connect(
    null,
    {
        tRemoveListItemContent,
    }
)(ListItem);
