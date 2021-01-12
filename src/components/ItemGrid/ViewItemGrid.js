import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import { Responsive as ResponsiveReactGridLayout } from 'react-grid-layout'
import { Layer, CenteredContent, CircularLoader } from '@dhis2/ui'
import { useWindowDimensions } from '../WindowDimensionsProvider'
import { Item } from '../Item/Item'
import {
    GRID_ROW_HEIGHT,
    SMALL_SCREEN_GRID_COLUMNS,
    getGridColumns,
    GRID_COMPACT_TYPE,
    MARGIN,
    hasShape,
    adjustSmallLayout,
} from './gridUtil'
import { orArray } from '../../modules/util'
import NoContentMessage from '../../widgets/NoContentMessage'
import { sGetSelectedId, sGetSelectedIsLoading } from '../../reducers/selected'
import {
    sGetDashboardById,
    sGetDashboardItems,
} from '../../reducers/dashboards'
import ProgressiveLoadingContainer from '../Item/ProgressiveLoadingContainer'
import { VIEW } from '../Dashboard/dashboardModes'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './styles/ItemGrid.css'

import classes from './styles/ViewItemGrid.module.css'

const EXPANDED_HEIGHT = 17
const SMALL_SCREEN_BREAKPOINT = 480
const SCROLLBAR_WIDTH = 8
// sum of left+right margin of the dashboard wrapper
const DASHBOARD_WRAPPER_LR_MARGIN = 20

const ResponsiveItemGrid = ({ isLoading, dashboardItems, layoutSmall }) => {
    const [expandedItems, setExpandedItems] = useState({})
    const [displayItems, setDisplayItems] = useState(dashboardItems)
    const [layoutSm, setLayoutSm] = useState(layoutSmall)

    useEffect(() => {
        setDisplayItems(dashboardItems.map(adjustHeightForExpanded))
        setLayoutSm(adjustSmallLayout(dashboardItems.slice()))
    }, [expandedItems, dashboardItems])

    const onToggleItemExpanded = clickedId => {
        const isExpanded =
            typeof expandedItems[clickedId] === 'boolean'
                ? expandedItems[clickedId]
                : false

        const newExpandedItems = { ...expandedItems }
        newExpandedItems[clickedId] = !isExpanded
        setExpandedItems(newExpandedItems)
    }

    const adjustHeightForExpanded = dashboardItem => {
        const expandedItem = expandedItems[dashboardItem.id]

        if (expandedItem && expandedItem === true) {
            return Object.assign({}, dashboardItem, {
                h: dashboardItem.h + EXPANDED_HEIGHT,
            })
        }

        return dashboardItem
    }

    const getItemComponent = item => (
        <ProgressiveLoadingContainer
            key={item.i}
            className={cx(item.type, 'view', `reactgriditem-${item.id}`)}
            itemId={item.id}
        >
            <Item
                item={item}
                dashboardMode={VIEW}
                onToggleItemExpanded={onToggleItemExpanded}
            />
        </ProgressiveLoadingContainer>
    )

    const getItemComponents = items => items.map(item => getItemComponent(item))

    if (!isLoading && !dashboardItems.length) {
        return (
            <NoContentMessage
                text={i18n.t('There are no items on this dashboard')}
            />
        )
    }

    const { width } = useWindowDimensions()

    return (
        <div className={classes.gridContainer}>
            {isLoading ? (
                <Layer translucent>
                    <CenteredContent>
                        <CircularLoader />
                    </CenteredContent>
                </Layer>
            ) : null}
            <ResponsiveReactGridLayout
                rowHeight={GRID_ROW_HEIGHT}
                width={width - DASHBOARD_WRAPPER_LR_MARGIN}
                cols={{ lg: getGridColumns(), sm: SMALL_SCREEN_GRID_COLUMNS }}
                breakpoints={{
                    lg: SMALL_SCREEN_BREAKPOINT - DASHBOARD_WRAPPER_LR_MARGIN,
                    sm: 0,
                }}
                layouts={{ lg: displayItems, sm: layoutSm }}
                compactType={GRID_COMPACT_TYPE}
                margin={MARGIN}
                containerPadding={{
                    lg: [SCROLLBAR_WIDTH, 0],
                    sm: [SCROLLBAR_WIDTH, 0],
                }}
                isDraggable={false}
                isResizable={false}
                draggableCancel="input,textarea"
            >
                {getItemComponents(displayItems)}
            </ResponsiveReactGridLayout>
        </div>
    )
}

ResponsiveItemGrid.propTypes = {
    dashboardItems: PropTypes.array,
    isLoading: PropTypes.bool,
    layoutSmall: PropTypes.array,
}

const mapStateToProps = state => {
    const selectedDashboard = sGetDashboardById(state, sGetSelectedId(state))
    const dashboardItems = orArray(sGetDashboardItems(state)).filter(hasShape)

    const layoutSmall = adjustSmallLayout(dashboardItems.slice())

    return {
        isLoading: sGetSelectedIsLoading(state) || !selectedDashboard,
        dashboardItems,
        layoutSmall,
    }
}

export default connect(mapStateToProps)(ResponsiveItemGrid)
