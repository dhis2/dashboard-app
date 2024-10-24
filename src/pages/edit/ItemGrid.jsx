import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Responsive as ResponsiveReactGridLayout } from 'react-grid-layout'
import { connect } from 'react-redux'
import { acUpdateDashboardItemShapes } from '../../actions/editDashboard.js'
import { Item } from '../../components/Item/Item.jsx'
import NoContentMessage from '../../components/NoContentMessage.jsx'
import ProgressiveLoadingContainer from '../../components/ProgressiveLoadingContainer.jsx'
import { useWindowDimensions } from '../../components/WindowDimensionsProvider.jsx'
import { EDIT } from '../../modules/dashboardModes.js'
import { getFirstOfTypes } from '../../modules/getFirstOfType.js'
import { getGridItemDomElementClassName } from '../../modules/getGridItemDomElementClassName.js'
import {
    GRID_ROW_HEIGHT_PX,
    GRID_COMPACT_TYPE,
    MARGIN_PX,
    GRID_PADDING_PX,
    GRID_COLUMNS,
    hasShape,
    getGridWidth,
    hasLayout,
} from '../../modules/gridUtil.js'
import { getBreakpoint } from '../../modules/smallScreen.js'
import { orArray } from '../../modules/util.js'
import {
    sGetEditDashboardItems,
    sGetHideGrid,
    sGetLayout,
} from '../../reducers/editDashboard.js'
import classes from './styles/ItemGrid.module.css'

const EditItemGrid = ({
    dashboardItems,
    acUpdateDashboardItemShapes,
    hasLayout,
    hideGrid,
}) => {
    const [gridWidth, setGridWidth] = useState({ width: 0 })
    const { width } = useWindowDimensions()
    const firstOfTypes = getFirstOfTypes(dashboardItems)

    const onLayoutChange = (newLayout) => {
        acUpdateDashboardItemShapes(newLayout)
    }

    const onWidthChanged = (containerWidth) =>
        setTimeout(() => setGridWidth({ width: containerWidth }), 200)

    const getItemComponent = (item) => {
        if (firstOfTypes.includes(item.id)) {
            item.firstOfType = true
        }
        return (
            <ProgressiveLoadingContainer
                key={item.i}
                className={cx(
                    item.type,
                    'edit',
                    getGridItemDomElementClassName(item.id)
                )}
                itemId={item.id}
            >
                <Item
                    item={item}
                    gridWidth={gridWidth.width}
                    dashboardMode={EDIT}
                />
            </ProgressiveLoadingContainer>
        )
    }

    const getItemComponents = (items) =>
        items.map((item) => getItemComponent(item))

    if (!dashboardItems.length) {
        return (
            <NoContentMessage
                text={i18n.t('There are no items on this dashboard')}
            />
        )
    }

    if (hideGrid) {
        return null
    }

    return (
        <ResponsiveReactGridLayout
            className={classes.grid}
            rowHeight={GRID_ROW_HEIGHT_PX}
            width={getGridWidth(width)}
            cols={{ lg: GRID_COLUMNS }}
            breakpoints={{
                lg: getBreakpoint(),
            }}
            layouts={{ lg: dashboardItems }}
            compactType={GRID_COMPACT_TYPE}
            margin={MARGIN_PX}
            containerPadding={{ lg: GRID_PADDING_PX }}
            onLayoutChange={onLayoutChange}
            onWidthChange={onWidthChanged}
            isDraggable={!hasLayout}
            isResizable={!hasLayout}
            draggableCancel="button,input,textarea"
        >
            {getItemComponents(dashboardItems)}
        </ResponsiveReactGridLayout>
    )
}

EditItemGrid.propTypes = {
    acUpdateDashboardItemShapes: PropTypes.func,
    dashboardItems: PropTypes.array,
    hasLayout: PropTypes.bool,
    hideGrid: PropTypes.bool,
}

// Container

const mapStateToProps = (state) => {
    return {
        dashboardItems: orArray(sGetEditDashboardItems(state)).filter(hasShape),
        hasLayout: hasLayout(sGetLayout(state)),
        hideGrid: sGetHideGrid(state),
    }
}

const mapDispatchToProps = {
    acUpdateDashboardItemShapes,
}

export default connect(mapStateToProps, mapDispatchToProps)(EditItemGrid)
