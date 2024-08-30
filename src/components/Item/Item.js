import { useCachedDataQuery } from '@dhis2/analytics'
import { useDataEngine } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React from 'react'
import {
    APP,
    VISUALIZATION,
    REPORT_TABLE,
    CHART,
    MAP,
    EVENT_CHART,
    EVENT_REPORT,
    EVENT_VISUALIZATION,
    MESSAGES,
    REPORTS,
    RESOURCES,
    USERS,
    TEXT,
    SPACER,
    PAGEBREAK,
    PRINT_TITLE_PAGE,
} from '../../modules/itemTypes.js'
import { WindowDimensionsCtx } from '../WindowDimensionsProvider.js'
import AppItem from './AppItem/Item.js'
import ListItem from './ListItem/Item.js'
import MessagesItem from './MessagesItem/Item.js'
import NotSupportedItem from './NotSupportedItem/Item.js'
import PageBreakItem from './PageBreakItem/Item.js'
import PrintTitlePageItem from './PrintTitlePageItem/Item.js'
import SpacerItem from './SpacerItem/Item.js'
import TextItem from './TextItem/Item.js'
import VisualizationItem from './VisualizationItem/Item.js'

const getGridItem = (type) => {
    switch (type) {
        case VISUALIZATION:
        case REPORT_TABLE:
        case CHART:
        case MAP:
        case EVENT_CHART:
        case EVENT_REPORT:
        case EVENT_VISUALIZATION:
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
        case PRINT_TITLE_PAGE:
            return PrintTitlePageItem
        default:
            return NotSupportedItem
    }
}

export const Item = (props) => {
    const { apps } = useCachedDataQuery()
    const engine = useDataEngine()
    const GridItem = getGridItem(props.item.type)

    return (
        <WindowDimensionsCtx.Consumer>
            {(windowDimensions) => (
                
                <GridItem apps={apps} {...props} engine={engine} windowDimensions={windowDimensions} />
            )}
        </WindowDimensionsCtx.Consumer>
    )
}

Item.propTypes = {
    item: PropTypes.object,
}
