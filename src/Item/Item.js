import React from 'react';

import PluginItem from './PluginItem/Item';
import MessagesItem from './MessagesItem/Item';
import NotSupportedItem from './NotSupportedItem/Item';
import ListItem from './ListItem/Item';

export const Item = props => {
    let GridItem = null;
    switch (props.item.type) {
        case 'CHART':
        case 'REPORT_TABLE':
        case 'MAP':
        case 'EVENT_CHART':
        case 'EVENT_REPORT':
            GridItem = PluginItem;
            break;
        case 'MESSAGES':
            GridItem = MessagesItem;
            break;
        case 'REPORTS':
        case 'RESOURCES':
        case 'USERS':
            GridItem = ListItem;
            break;
        default:
            GridItem = NotSupportedItem;
            break;
    }

    return (
        <GridItem
            item={props.item}
            editMode={props.editMode}
            onToggleItemExpanded={props.onToggleItemExpanded}
        />
    );
};
