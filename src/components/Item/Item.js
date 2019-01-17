import React from 'react';

import VisualizationItem from './VisualizationItem/Item';
import MessagesItem from './MessagesItem/Item';
import NotSupportedItem from './NotSupportedItem/Item';
import ListItem from './ListItem/Item';
import TextItem from './TextItem/Item';
import AppItem from './AppItem/Item';
import SpacerItem from './SpacerItem/Item';
import {
    APP,
    REPORT_TABLE,
    CHART,
    MAP,
    EVENT_CHART,
    EVENT_REPORT,
    MESSAGES,
    REPORTS,
    RESOURCES,
    USERS,
    TEXT,
    SPACER,
} from '../../modules/itemTypes';
import { DEFAULT_STATE_ITEM_FILTER } from '../../reducers/itemFilter';

const getGridItem = type => {
    switch (type) {
        case REPORT_TABLE:
        case CHART:
        case MAP:
        case EVENT_CHART:
        case EVENT_REPORT:
            return VisualizationItem;
        case MESSAGES:
            return MessagesItem;
        case REPORTS:
        case RESOURCES:
        case USERS:
            return ListItem;
        case TEXT:
            return TextItem;
        case SPACER:
            return SpacerItem;
        case APP:
            return AppItem;
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
            itemFilter={
                props.editMode ? DEFAULT_STATE_ITEM_FILTER : props.itemFilter
            }
            onToggleItemExpanded={props.onToggleItemExpanded}
        />
    );
};
