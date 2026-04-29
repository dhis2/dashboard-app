import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import { Responsive as ResponsiveReactGridLayout } from 'react-grid-layout'
import { connect } from 'react-redux'
import { acUpdateDashboardItemShapes } from '../../actions/editDashboard.js'
import { useContainerWidth } from '../../components/DashboardContainer.jsx'
import { Item } from '../../components/Item/Item.jsx'
import NoContentMessage from '../../components/NoContentMessage.jsx'
import ProgressiveLoadingContainer from '../../components/ProgressiveLoadingContainer.jsx'
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
    hasLayout,
} from '../../modules/gridUtil.js'
import { getBreakpoint } from '../../modules/smallScreen.js'
import { orArray } from '../../modules/util.js'
import {
    sGetEditDashboardItems,
    sGetHideGrid,
    sGetLayout,
} from '../../reducers/editDashboard.js'
import GridUnitsPopup from './GridUnitsPopup.jsx'
import classes from './styles/ItemGrid.module.css'

const DATA_TEST_PREFIX = 'dashboarditem-'

const EditItemGrid = ({
    dashboardItems,
    acUpdateDashboardItemShapes,
    hasLayout,
    hideGrid,
}) => {
    const containerWidth = useContainerWidth()
    const [gridWidth, setGridWidth] = useState({ width: 0 })
    const popupRef = useRef(null)
    const isResizingRef = useRef(false)
    const firstOfTypes = getFirstOfTypes(dashboardItems)

    const onLayoutChange = (newLayout) => {
        acUpdateDashboardItemShapes(newLayout)
    }

    const onWidthChanged = (containerWidth) =>
        setTimeout(() => setGridWidth({ width: containerWidth }), 200)

    const handleMouseMove = (e) => {
        if (isResizingRef.current) {
            return
        }
        const itemEl = e.target.closest(`[data-test^="${DATA_TEST_PREFIX}"]`)
        if (!itemEl) {
            popupRef.current?.hide()
            return
        }
        const itemId = itemEl
            .getAttribute('data-test')
            .slice(DATA_TEST_PREFIX.length)
        const item = dashboardItems.find((i) => i.id === itemId)
        if (item) {
            popupRef.current?.show({
                clientX: e.clientX,
                clientY: e.clientY,
                w: item.w,
                h: item.h,
            })
        }
    }

    const handleMouseLeave = () => {
        if (!isResizingRef.current) {
            popupRef.current?.hide()
        }
    }

    // react-grid-layout calls these with (layout, oldItem, newItem, placeholder, e, node)
    // eslint-disable-next-line max-params
    const onResizeStart = (_layout, _oldItem, newItem, _placeholder, e) => {
        isResizingRef.current = true
        popupRef.current?.show({
            clientX: e.clientX,
            clientY: e.clientY,
            w: newItem.w,
            h: newItem.h,
        })
    }

    // eslint-disable-next-line max-params
    const onResize = (_layout, _oldItem, newItem, _placeholder, e) => {
        popupRef.current?.show({
            clientX: e.clientX,
            clientY: e.clientY,
            w: newItem.w,
            h: newItem.h,
        })
    }

    const onResizeStop = () => {
        isResizingRef.current = false
        popupRef.current?.hide()
    }

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
                item={item}
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
        <div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <ResponsiveReactGridLayout
                className={classes.grid}
                rowHeight={GRID_ROW_HEIGHT_PX}
                width={containerWidth}
                cols={{ lg: GRID_COLUMNS }}
                breakpoints={{
                    lg: getBreakpoint(containerWidth),
                }}
                layouts={{ lg: dashboardItems }}
                compactType={GRID_COMPACT_TYPE}
                margin={MARGIN_PX}
                containerPadding={{ lg: GRID_PADDING_PX }}
                onLayoutChange={onLayoutChange}
                onWidthChange={onWidthChanged}
                onResizeStart={onResizeStart}
                onResize={onResize}
                onResizeStop={onResizeStop}
                isDraggable={!hasLayout}
                isResizable={!hasLayout}
                draggableCancel="button,input,textarea"
            >
                {getItemComponents(dashboardItems)}
            </ResponsiveReactGridLayout>
            <GridUnitsPopup ref={popupRef} />
        </div>
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
