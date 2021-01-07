import React, { useState } from 'react'
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
    GRID_COLUMNS,
    GRID_COMPACT_TYPE,
    MARGIN,
    hasShape,
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
import './ItemGrid.css'

const EXPANDED_HEIGHT = 17

const ResponsiveItemGrid = ({ isLoading, dashboardItems }) => {
    const [expandedItems, setExpandedItems] = useState({})
    const { width } = useWindowDimensions()

    const onToggleItemExpanded = clickedId => {
        const isExpanded =
            typeof expandedItems[clickedId] === 'boolean'
                ? expandedItems[clickedId]
                : false

        const newExpandedItems = { ...expandedItems }
        newExpandedItems[clickedId] = !isExpanded
        setExpandedItems(expandedItems)
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
            className={cx(item.type, 'view')}
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

    const items = dashboardItems.map(adjustHeightForExpanded)

    return (
        <div className="grid-wrapper">
            {isLoading ? (
                <Layer translucent>
                    <CenteredContent>
                        <CircularLoader />
                    </CenteredContent>
                </Layer>
            ) : null}
            <ResponsiveReactGridLayout
                rowHeight={GRID_ROW_HEIGHT}
                width={width}
                cols={{ lg: GRID_COLUMNS, sm: 9 }} // min-width for items in dashboard was 9 columns
                breakpoints={{ lg: 452, sm: 0 }}
                layouts={{ lg: items }}
                measureBeforeMount={true}
                compactType={GRID_COMPACT_TYPE}
                margin={MARGIN}
                isDraggable={false}
                isResizable={false}
                draggableCancel="input,textarea"
            >
                {getItemComponents(items)}
            </ResponsiveReactGridLayout>
        </div>
    )
}

ResponsiveItemGrid.propTypes = {
    dashboardItems: PropTypes.array,
    isLoading: PropTypes.bool,
}

const mapStateToProps = state => {
    const selectedDashboard = sGetDashboardById(state, sGetSelectedId(state))
    const dashboardItems = orArray(sGetDashboardItems(state)).filter(hasShape)

    return {
        isLoading: sGetSelectedIsLoading(state) || !selectedDashboard,
        dashboardItems,
    }
}

export default connect(mapStateToProps)(ResponsiveItemGrid)
