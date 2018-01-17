import React from 'react';

import PluginItem from './PluginItem/Item';
import MessagesItem from './MessagesItem/Item';

const Items = {
    PluginItem,
    MessagesItem,
};

export const Item = props => {
    let GridItem = null;
    switch (props.item.type) {
        case 'CHART':
        case 'REPORT_TABLE':
            GridItem = Items.PluginItem;
            break;
        case 'MESSAGES':
            GridItem = Items.MessagesItem;
            break;
        default:
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
