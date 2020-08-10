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
import { isEditMode } from '../Dashboard/dashboardModes'
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
import { DEFAULT_STATE_ITEM_FILTERS } from '../../reducers/itemFilters'

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

export const Item = props => {
    const GridItem = getGridItem(props.item.type)

    return (
        <GridItem
            item={props.item}
            dashboardMode={props.dashboardMode}
            itemFilters={
                !isEditMode(props.dashboardMode)
                    ? props.itemFilters
                    : DEFAULT_STATE_ITEM_FILTERS
            }
            onToggleItemExpanded={props.onToggleItemExpanded}
        />
    )
}

Item.propTypes = {
    dashboardMode: PropTypes.string,
    item: PropTypes.object,
    itemFilters: PropTypes.object,
    onToggleItemExpanded: PropTypes.func,
}
