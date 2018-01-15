import React from 'react';

import PluginItem from './PluginItem/Item';

const Items = {
    PluginItem,
};

export const Item = props => {
    let GridItem = null;
    switch (props.item.type) {
        case 'CHART':
        case 'REPORT_TABLE':
            GridItem = Items.PluginItem;
            break;
        default:
            break;
    }

    return (
        <GridItem
            item={props.item}
            editMode={props.editMode}
            onToggleItemFooter={props.onToggleItemFooter}
        />
    );
};
