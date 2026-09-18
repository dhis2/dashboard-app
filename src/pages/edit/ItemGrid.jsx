import cx from 'classnames'
import PropTypes from 'prop-types'
import React, {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react'
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
    applyHeightToRowsOf,
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
    sGetLayoutColumns,
} from '../../reducers/editDashboard.js'
import FirstRunLayoutChoice from './FirstRunLayoutChoice.jsx'
import GridUnitsPopup from './GridUnitsPopup.jsx'
import MultiSelectToolbar from './MultiSelectToolbar.jsx'
import SizeToolbar from './SizeToolbar.jsx'
import classes from './styles/ItemGrid.module.css'

const DATA_TEST_PREFIX = 'dashboarditem-'

// Pixel geometry of the editor grid, derived the same way react-grid-layout
// derives item positions. Used for both the grid-guide CSS vars and the
// "add here" insertion zones, so the two stay pixel-aligned.
const getGridMetrics = (containerWidth, columns, groupSize = 1) => {
    const colWidth =
        (containerWidth -
            GRID_PADDING_PX[0] * 2 -
            MARGIN_PX[0] * (columns - 1)) /
        columns

    if (colWidth <= 0) {
        return null
    }

    const units = Math.max(1, groupSize)

    return {
        colWidth: units * colWidth + (units - 1) * MARGIN_PX[0],
        colStep: units * (colWidth + MARGIN_PX[0]),
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
    layoutColumns,
}) => {
    const containerWidth = useContainerWidth()
    const [gridWidth, setGridWidth] = useState({ width: 0 })
    const [selectedIds, setSelectedIds] = useState([])
    const [liveResize, setLiveResize] = useState(null)
    const [anchorRect, setAnchorRect] = useState(null)
    const [resizingAxis, setResizingAxis] = useState(null)
    const popupRef = useRef(null)
    const gridWrapperRef = useRef(null)
    const resizeLineRef = useRef(null)
    const isResizingRef = useRef(false)
    const isMultiResizingRef = useRef(false)
    const pendingMultiResizeRef = useRef(null)
    const resizeGroupIdsRef = useRef(null)
    const firstOfTypes = getFirstOfTypes(dashboardItems)

    // The Fixed-columns auto-layout owns item placement, so it stays at the
    // canonical resolution. Freeflow respects the editor-only column setting.
    const effectiveColumns = hasLayout ? GRID_COLUMNS : gridColumns

    const baseDisplayItems = dashboardItems.map((item) =>
        toDisplayShape(item, effectiveColumns)
    )

    // Height can be resized in both modes. Width (and the size toolbar) stay
    // Flexible-only. In Fixed mode, every item in a row shares height.
    const canEditWidth = !hasLayout
    const selectedHeight = getSelectedHeight(baseDisplayItems, selectedIds)
    const isEqualHeightGroup =
        canEditWidth && selectedIds.length >= 2 && selectedHeight !== null

    const displayItems = baseDisplayItems.map((item) => {
        if (hasLayout) {
            return { ...item, resizeHandles: ['s'] }
        }
        if (isEqualHeightGroup && selectedIds.includes(item.id)) {
            return { ...item, resizeHandles: ['s'] }
        }
        return item
    })

    const guideGroupSize =
        hasLayout && layoutColumns.length
            ? Math.floor(effectiveColumns / layoutColumns.length)
            : 1

    const gridMetrics = getGridMetrics(
        containerWidth,
        effectiveColumns,
        guideGroupSize
    )

    const singleSelectedItem =
        canEditWidth && selectedIds.length === 1
            ? displayItems.find((item) => item.id === selectedIds[0])
            : null

    // Anchor the editable size indicator to the selected item's bottom-right
    // corner (where the resize handle / units popup sits). Recompute on shape
    // change, scroll and resize so it stays pinned to the item.
    useLayoutEffect(() => {
        // While a resize is live, the resize handler owns anchorRect (it pins to
        // the growing item corner). Don't fight it here.
        if (liveResize) {
            return
        }
        if (!singleSelectedItem) {
            setAnchorRect(null)
            return
        }
        const update = () => {
            const el = document.querySelector(
                `.${getGridItemDomElementClassName(singleSelectedItem.id)}`
            )
            if (el) {
                setAnchorRect(el.getBoundingClientRect())
            }
        }
        update()
        window.addEventListener('scroll', update, true)
        window.addEventListener('resize', update)
        return () => {
            window.removeEventListener('scroll', update, true)
            window.removeEventListener('resize', update)
        }
    }, [
        singleSelectedItem?.id,
        singleSelectedItem?.w,
        singleSelectedItem?.h,
        singleSelectedItem?.x,
        singleSelectedItem?.y,
        containerWidth,
        liveResize,
    ])

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

    const handleSetSelectedHeight = (h) => {
        const updated = hasLayout
            ? applyHeightToRowsOf(baseDisplayItems, selectedIds, h)
            : applyHeightToItems(baseDisplayItems, selectedIds, h)
        acUpdateDashboardItemShapes(
            updated.map((item) => toStorageShape(item, effectiveColumns))
        )
    }

    const handleSetItemSize = (itemId, { w, h }) => {
        const updated = baseDisplayItems.map((item) =>
            item.id === itemId ? { ...item, w, h } : item
        )
        acUpdateDashboardItemShapes(
            updated.map((item) => toStorageShape(item, effectiveColumns))
        )
    }

    const handleDeleteSelected = () => {
        selectedIds.forEach((id) => acRemoveDashboardItem(id))
        clearSelection()
    }

    const onLayoutChange = (newLayout) => {
        const pending = pendingMultiResizeRef.current
        pendingMultiResizeRef.current = null

        let layout = newLayout
        if (pending) {
            const inGroup = (item) =>
                pending.ids.includes(item.i) || pending.ids.includes(item.id)
            const group = newLayout.filter(inGroup)
            const rowY = group.reduce(
                (min, item) => Math.min(min, item.y),
                Infinity
            )
            const peer = group.find((item) => item.i !== pending.sourceId)
            const oldH = peer?.h ?? pending.h
            const delta = pending.h - oldH
            layout = applyHeightToItems(newLayout, pending.ids, pending.h)
            if (delta) {
                layout = layout.map((item) =>
                    inGroup(item) || item.y <= rowY
                        ? item
                        : { ...item, y: item.y + delta }
                )
            }
        }

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
        // The single-selected item has its own persistent editable indicator,
        // so don't also show the hover popup over it.
        if (itemId === singleSelectedItem?.id) {
            popupRef.current?.hide()
            return
        }
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
    // Keep the item-glued indicator as the one and only readout for a single
    // resize: update its values and re-pin it to the live (growing) item corner
    // instead of flashing the separate cursor popup. (The equal-height group
    // resize keeps the cursor popup + group line.)
    const trackResize = (newItem) => {
        setLiveResize({ id: newItem.i, w: newItem.w, h: newItem.h })
        const el = document.querySelector(
            `.${getGridItemDomElementClassName(newItem.i)}`
        )
        if (el) {
            setAnchorRect(el.getBoundingClientRect())
        }
    }

    const onResizeStart = (_layout, _oldItem, newItem, _placeholder, e) => {
        isResizingRef.current = true
        // Which handle was grabbed (e / s / se), read off the event target so
        // only that one gets the active highlight.
        const cls = String(e?.target?.className || '')
        setResizingAxis(
            ['se', 'e', 's'].find((axis) =>
                cls.includes(`react-resizable-handle-${axis}`)
            ) || null
        )
        isMultiResizingRef.current =
            (isEqualHeightGroup && selectedIds.includes(newItem.i)) ||
            hasLayout
        if (isMultiResizingRef.current) {
            resizeGroupIdsRef.current = hasLayout
                ? baseDisplayItems
                      .filter((item) => item.y === newItem.y)
                      .map((item) => item.id)
                : [...selectedIds]
            if (!resizeGroupIdsRef.current.length) {
                resizeGroupIdsRef.current = [newItem.i]
            }
            showGroupResizeLine(e.clientY)
            popupRef.current?.show({
                clientX: e.clientX,
                clientY: e.clientY,
                w: newItem.w,
                h: newItem.h,
            })
            return
        }
        trackResize(newItem)
    }

    // eslint-disable-next-line max-params
    const onResize = (_layout, _oldItem, newItem, _placeholder, e) => {
        if (isMultiResizingRef.current) {
            showGroupResizeLine(e.clientY)
            popupRef.current?.show({
                clientX: e.clientX,
                clientY: e.clientY,
                w: newItem.w,
                h: newItem.h,
            })
            return
        }
        trackResize(newItem)
    }

    // eslint-disable-next-line max-params
    const onResizeStop = (_layout, _oldItem, newItem) => {
        // Snap the rest of the selected items to the dragged item's new height
        // on release; the synced height is applied in onLayoutChange.
        if (isMultiResizingRef.current && newItem) {
            pendingMultiResizeRef.current = {
                ids: resizeGroupIdsRef.current || [...selectedIds],
                h: newItem.h,
                sourceId: newItem.i,
            }
        }
        isResizingRef.current = false
        isMultiResizingRef.current = false
        setLiveResize(null)
        setResizingAxis(null)
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
        return (
            <div
                className={cx(classes.gridWrapper, classes.empty)}
                style={getGridGuideStyle(gridMetrics)}
            >
                <FirstRunLayoutChoice />
            </div>
        )
    }

    if (hideGrid) {
        return null
    }

    // The size indicator follows the item being resized (even if it wasn't the
    // selected one), otherwise the single-selected item.
    const indicatorItem = liveResize
        ? displayItems.find((item) => item.id === liveResize.id)
        : singleSelectedItem

    return (
        <>
            {indicatorItem && anchorRect && (
                <SizeToolbar
                    w={liveResize ? liveResize.w : indicatorItem.w}
                    h={liveResize ? liveResize.h : indicatorItem.h}
                    maxW={effectiveColumns}
                    style={{
                        bottom: `${
                            window.innerHeight - anchorRect.bottom + 12
                        }px`,
                        right: `${window.innerWidth - anchorRect.right + 12}px`,
                    }}
                    onChange={(size) =>
                        handleSetItemSize(indicatorItem.id, size)
                    }
                />
            )}
            {selectedIds.length >= 2 && (
                <MultiSelectToolbar
                    count={selectedIds.length}
                    canEditHeight
                    canSetSameHeight={!hasLayout}
                    isEqualHeight={isEqualHeightGroup}
                    height={selectedHeight}
                    maxHeight={getMaxSelectedHeight(
                        baseDisplayItems,
                        selectedIds
                    )}
                    onSetHeight={handleSetSelectedHeight}
                    onSetSameHeight={handleSetSameHeight}
                    onDelete={handleDeleteSelected}
                />
            )}
            <div
                ref={gridWrapperRef}
                className={classes.gridWrapper}
                style={getGridGuideStyle(gridMetrics)}
                data-resize-axis={resizingAxis || undefined}
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
                    // Corner (both axes) plus axis-locked edge handles: right
                    // resizes width only, bottom resizes height only. (The
                    // equal-height group overrides this with ['s'] per item.)
                    resizeHandles={['e', 's', 'se']}
                    onLayoutChange={onLayoutChange}
                    onWidthChange={onWidthChanged}
                    onResizeStart={onResizeStart}
                    onResize={onResize}
                    onResizeStop={onResizeStop}
                    isDraggable={!hasLayout}
                    isResizable={true}
                    draggableCancel="button,input,textarea"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    {getItemComponents(displayItems)}
                </ResponsiveReactGridLayout>
            </div>
            <GridUnitsPopup ref={popupRef} hideWidth={hasLayout} />
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
    layoutColumns: PropTypes.array,
}

// Container

const mapStateToProps = (state) => {
    return {
        dashboardItems: orArray(sGetEditDashboardItems(state)).filter(hasShape),
        hasLayout: hasLayout(sGetLayout(state)),
        hideGrid: sGetHideGrid(state),
        gridColumns: sGetEditGridColumns(state),
        layoutColumns: sGetLayoutColumns(state),
    }
}

const mapDispatchToProps = {
    acUpdateDashboardItemShapes,
    acRemoveDashboardItem,
}

export default connect(mapStateToProps, mapDispatchToProps)(EditItemGrid)
