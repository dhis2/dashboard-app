import React from 'react';

import PluginItem from './PluginItem/Item';
import MessagesItem from './MessagesItem/Item';
import NotSupportedItem from './NotSupportedItem/Item';
import ListItem from './ListItem/Item';
import {
    REPORT_TABLE,
    CHART,
    MAP,
    EVENT_CHART,
    EVENT_REPORT,
    MESSAGES,
    REPORTS,
    RESOURCES,
    USERS,
} from '../util';

const getGridItem = type => {
    switch (type) {
        case REPORT_TABLE:
        case CHART:
        case MAP:
        case EVENT_CHART:
        case EVENT_REPORT:
            return PluginItem;
        case MESSAGES:
            return MessagesItem;
        case REPORTS:
        case RESOURCES:
        case USERS:
            return ListItem;
        default:
            return NotSupportedItem;
    }
};

export const Item = props => {
    const GridItem = getGridItem(props.item.type);

    return (
        <GridItem
            item={props.item}
            editMode={props.editMode}
            onToggleItemExpanded={props.onToggleItemExpanded}
            onRemoveItem={props.onRemoveItem}
        />
    );
};
