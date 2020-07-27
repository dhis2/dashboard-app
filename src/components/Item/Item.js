import React from 'react'
import PropTypes from 'prop-types'

import VisualizationItem from './VisualizationItem/Item'
import MessagesItem from './MessagesItem/Item'
import NotSupportedItem from './NotSupportedItem/Item'
import ListItem from './ListItem/Item'
import TextItem from './TextItem/Item'
import AppItem from './AppItem/Item'
import SpacerItem from './SpacerItem/Item'
import PageBreakItem from './PageBreakItem/Item'
import {
    APP,
    VISUALIZATION,
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
    PAGEBREAK,
} from '../../modules/itemTypes'

const getGridItem = type => {
    switch (type) {
        case VISUALIZATION:
        case REPORT_TABLE:
        case CHART:
        case MAP:
        case EVENT_CHART:
        case EVENT_REPORT:
            return VisualizationItem
        case MESSAGES:
            return MessagesItem
        case REPORTS:
        case RESOURCES:
        case USERS:
            return ListItem
        case TEXT:
            return TextItem
        case SPACER:
            return SpacerItem
        case APP:
            return AppItem
        case PAGEBREAK:
            return PageBreakItem
        default:
            return NotSupportedItem
    }
}

export const Item = ({ item, onToggleItemExpanded }) => {
    const GridItem = getGridItem(item.type)

    return <GridItem item={item} onToggleItemExpanded={onToggleItemExpanded} />
}

Item.propTypes = {
    item: PropTypes.object,
    onToggleItemExpanded: PropTypes.func,
}
