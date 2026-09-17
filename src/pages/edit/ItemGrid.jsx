import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import { Responsive as ResponsiveReactGridLayout } from 'react-grid-layout'
import { connect } from 'react-redux'
import {
    acUpdateDashboardItemShapes,
    acRemoveDashboardItem,
} from '../../actions/editDashboard.js'
import { useContainerWidth } from '../../components/DashboardContainer.jsx'
import { Item } from '../../components/Item/Item.jsx'
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
    toDisplayShape,
    toStorageShape,
    getSelectedHeight,
    getMaxSelectedHeight,
    applyHeightToItems,
    swapItemPositions,
} from '../../modules/gridUtil.js'
import {
    getPendingScrollItem,
    clearPendingScrollItem,
} from '../../modules/scrollToNewItem.js'
import { getBreakpoint } from '../../modules/smallScreen.js'
import { orArray } from '../../modules/util.js'
import {
    sGetEditDashboardItems,
    sGetHideGrid,
    sGetLayout,
    sGetEditGridColumns,
} from '../../reducers/editDashboard.js'
import FirstRunLayoutChoice from './FirstRunLayoutChoice.jsx'
import GridUnitsPopup from './GridUnitsPopup.jsx'
import MultiSelectToolbar from './MultiSelectToolbar.jsx'
import classes from './styles/ItemGrid.module.css'

const DATA_TEST_PREFIX = 'dashboarditem-'

// Pixel geometry of the editor grid, derived the same way react-grid-layout
// derives item positions. Used for both the grid-guide CSS vars and the
// "add here" insertion zones, so the two stay pixel-aligned.
const getGridMetrics = (containerWidth, columns) => {
    const colWidth =
        (containerWidth -
            GRID_PADDING_PX[0] * 2 -
            MARGIN_PX[0] * (columns - 1)) /
        columns

    if (colWidth <= 0) {
        return null
    }

    return {
        colWidth,
        colStep: colWidth + MARGIN_PX[0],
        rowHeight: GRID_ROW_HEIGHT_PX,
        rowStep: GRID_ROW_HEIGHT_PX + MARGIN_PX[1],
    }
}

const getGridGuideStyle = (metrics) => {
    if (!metrics) {
        return null
    }

    return {
        '--dashboard-grid-column-width': `${metrics.colWidth}px`,
        '--dashboard-grid-column-step': `${metrics.colStep}px`,
        '--dashboard-grid-row-height': `${metrics.rowHeight}px`,
        '--dashboard-grid-row-step': `${metrics.rowStep}px`,
    }
}

const EditItemGrid = ({
    dashboardItems,
    acUpdateDashboardItemShapes,
    acRemoveDashboardItem,
    hasLayout,
    hideGrid,
    gridColumns,
}) => {
    const containerWidth = useContainerWidth()
    const [gridWidth, setGridWidth] = useState({ width: 0 })
    const [selectedIds, setSelectedIds] = useState([])
    const popupRef = useRef(null)
    const gridWrapperRef = useRef(null)
    const resizeLineRef = useRef(null)
    const isResizingRef = useRef(false)
    const isMultiResizingRef = useRef(false)
    const pendingMultiResizeRef = useRef(null)
    const firstOfTypes = getFirstOfTypes(dashboardItems)

    // The Fixed-columns auto-layout owns item placement, so it stays at the
    // canonical resolution. Freeflow respects the editor-only column setting.
    const effectiveColumns = hasLayout ? GRID_COLUMNS : gridColumns

    const baseDisplayItems = dashboardItems.map((item) =>
        toDisplayShape(item, effectiveColumns)
    )

    // Multi-select is only available in Freeflow mode, where resizing is enabled.
    const multiSelectEnabled = !hasLayout
    const selectedHeight = getSelectedHeight(baseDisplayItems, selectedIds)
    const isEqualHeightGroup =
        multiSelectEnabled && selectedIds.length >= 2 && selectedHeight !== null

    // Lock the equal-height selection to a vertical-only resize gesture so the
    // synced resize only affects height.
    const displayItems = baseDisplayItems.map((item) =>
        isEqualHeightGroup && selectedIds.includes(item.id)
            ? { ...item, resizeHandles: ['s'] }
            : item
    )

    const gridMetrics = getGridMetrics(containerWidth, effectiveColumns)

    // Drop selected ids that no longer exist (e.g. an item was deleted).
    useEffect(() => {
        setSelectedIds((prev) => {
            const next = prev.filter((id) =>
                dashboardItems.some((item) => item.id === id)
            )
            return next.length === prev.length ? prev : next
        })
    }, [dashboardItems])

    // Click-to-add appends an item at the top/bottom of the canvas, which may be
    // off-screen. Once react-grid-layout has positioned the new item, scroll it
    // into view (the next frame ensures its transform is applied first).
    useEffect(() => {
        const pendingId = getPendingScrollItem()
        if (!pendingId) {
            return
        }
        const frame = requestAnimationFrame(() => {
            const el = document.querySelector(
                `.${getGridItemDomElementClassName(pendingId)}`
            )
            el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
            clearPendingScrollItem()
        })
        return () => cancelAnimationFrame(frame)
    }, [dashboardItems])

    // Reset the selection when the layout mode or column resolution changes.
    useEffect(() => {
        setSelectedIds([])
    }, [hasLayout, effectiveColumns])

    // Clear the selection on Escape.
    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                setSelectedIds([])
            }
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [])

    const toggleSelected = (itemId) =>
        setSelectedIds((prev) =>
            prev.includes(itemId)
                ? prev.filter((id) => id !== itemId)
                : [...prev, itemId]
        )

    const clearSelection = () => setSelectedIds([])

    const handleClickCapture = (e) => {
        if (!multiSelectEnabled) {
            return
        }
        const isModifierClick = e.shiftKey || e.metaKey || e.ctrlKey
        if (!isModifierClick) {
            return
        }
        if (e.target.closest('button, input, textarea, a')) {
            return
        }
        const itemEl = e.target.closest(`[data-test^="${DATA_TEST_PREFIX}"]`)
        if (!itemEl) {
            return
        }
        e.preventDefault()
        e.stopPropagation()
        const itemId = itemEl
            .getAttribute('data-test')
            .slice(DATA_TEST_PREFIX.length)
        toggleSelected(itemId)
    }

    const handleClick = (e) => {
        if (e.shiftKey || e.metaKey || e.ctrlKey) {
            return
        }
        const itemEl = e.target.closest(`[data-test^="${DATA_TEST_PREFIX}"]`)
        if (!itemEl) {
            clearSelection()
            return
        }
        // Don't hijack clicks on interactive controls (item menu, launch links).
        if (e.target.closest('button, input, textarea, a')) {
            return
        }
        const itemId = itemEl
            .getAttribute('data-test')
            .slice(DATA_TEST_PREFIX.length)
        setSelectedIds([itemId])
    }

    const handleSetSameHeight = () => {
        const maxH = getMaxSelectedHeight(baseDisplayItems, selectedIds)
        if (maxH === null) {
            return
        }
        const updated = applyHeightToItems(baseDisplayItems, selectedIds, maxH)
        acUpdateDashboardItemShapes(
            updated.map((item) => toStorageShape(item, effectiveColumns))
        )
    }

    const handleSwapPositions = () => {
        if (selectedIds.length !== 2) {
            return
        }
        const swapped = swapItemPositions(baseDisplayItems, selectedIds)
        acUpdateDashboardItemShapes(
            swapped.map((item) => toStorageShape(item, effectiveColumns))
        )
    }

    const handleDeleteSelected = () => {
        selectedIds.forEach((id) => acRemoveDashboardItem(id))
        clearSelection()
    }

    const onLayoutChange = (newLayout) => {
        const pending = pendingMultiResizeRef.current
        pendingMultiResizeRef.current = null

        const layout = pending
            ? applyHeightToItems(newLayout, pending.ids, pending.h)
            : newLayout

        acUpdateDashboardItemShapes(
            layout.map((item) => toStorageShape(item, effectiveColumns))
        )
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
        const item = displayItems.find((i) => i.id === itemId)
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

    // Show a full-width guide line at the dragged bottom edge to signal that the
    // whole selection is being resized together.
    const showGroupResizeLine = (clientY) => {
        const wrapper = gridWrapperRef.current
        const line = resizeLineRef.current
        if (!wrapper || !line) {
            return
        }
        const rect = wrapper.getBoundingClientRect()
        line.style.top = `${clientY - rect.top}px`
        line.style.display = 'block'
    }

    const hideGroupResizeLine = () => {
        if (resizeLineRef.current) {
            resizeLineRef.current.style.display = 'none'
        }
    }

    // react-grid-layout calls these with (layout, oldItem, newItem, placeholder, e, node)
    // eslint-disable-next-line max-params
    const onResizeStart = (_layout, _oldItem, newItem, _placeholder, e) => {
        isResizingRef.current = true
        isMultiResizingRef.current =
            isEqualHeightGroup && selectedIds.includes(newItem.i)
        if (isMultiResizingRef.current) {
            showGroupResizeLine(e.clientY)
        }
        popupRef.current?.show({
            clientX: e.clientX,
            clientY: e.clientY,
            w: newItem.w,
            h: newItem.h,
        })
    }

    // eslint-disable-next-line max-params
    const onResize = (_layout, _oldItem, newItem, _placeholder, e) => {
        if (isMultiResizingRef.current) {
            showGroupResizeLine(e.clientY)
        }
        popupRef.current?.show({
            clientX: e.clientX,
            clientY: e.clientY,
            w: newItem.w,
            h: newItem.h,
        })
    }

    // eslint-disable-next-line max-params
    const onResizeStop = (_layout, _oldItem, newItem) => {
        // Snap the rest of the selected items to the dragged item's new height
        // on release; the synced height is applied in onLayoutChange.
        if (isMultiResizingRef.current && newItem) {
            pendingMultiResizeRef.current = {
                ids: [...selectedIds],
                h: newItem.h,
            }
        }
        isResizingRef.current = false
        isMultiResizingRef.current = false
        hideGroupResizeLine()
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
                    getGridItemDomElementClassName(item.id),
                    { selected: selectedIds.includes(item.id) }
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
        return <FirstRunLayoutChoice />
    }

    if (hideGrid) {
        return null
    }

    return (
        <>
            {multiSelectEnabled && selectedIds.length >= 2 && (
                <MultiSelectToolbar
                    count={selectedIds.length}
                    isEqualHeight={isEqualHeightGroup}
                    canSwap={selectedIds.length === 2}
                    onSetSameHeight={handleSetSameHeight}
                    onSwapPositions={handleSwapPositions}
                    onDelete={handleDeleteSelected}
                    onClear={clearSelection}
                />
            )}
            <div
                ref={gridWrapperRef}
                className={classes.gridWrapper}
                style={getGridGuideStyle(gridMetrics)}
                onClickCapture={handleClickCapture}
                onClick={handleClick}
            >
                <div
                    ref={resizeLineRef}
                    className={classes.resizeGroupLine}
                    data-test="multi-resize-group-line"
                />
                <ResponsiveReactGridLayout
                    rowHeight={GRID_ROW_HEIGHT_PX}
                    width={containerWidth}
                    cols={{ lg: effectiveColumns }}
                    breakpoints={{
                        lg: getBreakpoint(containerWidth),
                    }}
                    layouts={{ lg: displayItems }}
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
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    {getItemComponents(displayItems)}
                </ResponsiveReactGridLayout>
            </div>
            <GridUnitsPopup ref={popupRef} />
        </>
    )
}

EditItemGrid.propTypes = {
    acRemoveDashboardItem: PropTypes.func,
    acUpdateDashboardItemShapes: PropTypes.func,
    dashboardItems: PropTypes.array,
    gridColumns: PropTypes.number,
    hasLayout: PropTypes.bool,
    hideGrid: PropTypes.bool,
}

// Container

const mapStateToProps = (state) => {
    return {
        dashboardItems: orArray(sGetEditDashboardItems(state)).filter(hasShape),
        hasLayout: hasLayout(sGetLayout(state)),
        hideGrid: sGetHideGrid(state),
        gridColumns: sGetEditGridColumns(state),
    }
}

const mapDispatchToProps = {
    acUpdateDashboardItemShapes,
    acRemoveDashboardItem,
}

export default connect(mapStateToProps, mapDispatchToProps)(EditItemGrid)
