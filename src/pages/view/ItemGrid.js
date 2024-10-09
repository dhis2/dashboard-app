import i18n from '@dhis2/d2-i18n'
import {
    IconChevronRight24,
    IconChevronLeft24,
    IconCross24,
    colors,
} from '@dhis2/ui'
import cx from 'classnames'
import sortBy from 'lodash/sortBy.js'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Responsive as ResponsiveReactGridLayout } from 'react-grid-layout'
import { useDispatch, useSelector } from 'react-redux'
import { acSetPresentDashboard } from '../../actions/presentDashboard.js'
import { Item } from '../../components/Item/Item.js'
import NoContentMessage from '../../components/NoContentMessage.js'
import ProgressiveLoadingContainer from '../../components/ProgressiveLoadingContainer.js'
import { useWindowDimensions } from '../../components/WindowDimensionsProvider.js'
import { VIEW } from '../../modules/dashboardModes.js'
import { getFirstOfTypes } from '../../modules/getFirstOfType.js'
import { getGridItemDomElementClassName } from '../../modules/getGridItemDomElementClassName.js'
import {
    GRID_ROW_HEIGHT_PX,
    SM_SCREEN_GRID_COLUMNS,
    GRID_COMPACT_TYPE,
    GRID_PADDING_PX,
    MARGIN_PX,
    MARGIN_SM_PX,
    GRID_COLUMNS,
    getSmallLayout,
    getGridWidth,
    getProportionalHeight,
} from '../../modules/gridUtil.js'
import { SPACER, MESSAGES } from '../../modules/itemTypes.js'
import { getBreakpoint, isSmallScreen } from '../../modules/smallScreen.js'
import { useCacheableSection } from '../../modules/useCacheableSection.js'
import { sGetPresentDashboard } from '../../reducers/presentDashboard.js'
import {
    sGetSelectedId,
    sGetSelectedDashboardItems,
} from '../../reducers/selected.js'
import classes from './styles/ItemGrid.module.css'

const EXPANDED_HEIGHT = 19
const EXPANDED_HEIGHT_SM = 15

const ResponsiveItemGrid = () => {
    const dispatch = useDispatch()
    const dashboardId = useSelector(sGetSelectedId)
    const dashboardItems = useSelector(sGetSelectedDashboardItems)

    const { width } = useWindowDimensions()
    const [expandedItems, setExpandedItems] = useState({})
    const [displayItems, setDisplayItems] = useState(dashboardItems)
    const [layoutSm, setLayoutSm] = useState([])
    const [gridWidth, setGridWidth] = useState(0)
    const [forceLoad, setForceLoad] = useState(false)
    const { recordingState } = useCacheableSection(dashboardId)
    const firstOfTypes = getFirstOfTypes(dashboardItems)

    // for slideshow
    const sItems = useRef([])
    const fsItemStartingIndex = useSelector(sGetPresentDashboard)
    const [fsItemIndex, setFsItemIndex] = useState(null)
    const fsElement = useRef(null)
    const hideControlsTimeout = useRef(null)
    const controlsRef = useRef(null)

    useEffect(() => {
        const getItemsWithAdjustedHeight = (items) =>
            items.map((item) => {
                const expandedItem = expandedItems[item.id]

                if (expandedItem && expandedItem === true) {
                    const expandedHeight = isSmallScreen(width)
                        ? EXPANDED_HEIGHT_SM
                        : EXPANDED_HEIGHT
                    return Object.assign({}, item, {
                        h: item.h + expandedHeight,
                        smallOriginalH: getProportionalHeight(item, width),
                    })
                }

                return item
            })
        setLayoutSm(
            getItemsWithAdjustedHeight(getSmallLayout(dashboardItems, width))
        )
        setDisplayItems(getItemsWithAdjustedHeight(dashboardItems))
    }, [expandedItems, width, dashboardItems])

    useEffect(() => {
        if (recordingState === 'recording') {
            setForceLoad(true)
        }
    }, [recordingState])

    useEffect(() => {
        const sortedItems = sortBy(displayItems, ['y', 'x']).filter(
            (i) => [SPACER, MESSAGES].indexOf(i.type) === -1
        )
        sItems.current = sortedItems
    }, [displayItems])

    // Handle Present button or Item Fullscreen button clicked
    useEffect(() => {
        if (Number.isInteger(fsItemStartingIndex)) {
            const el = fsElement?.current
            el?.requestFullscreen()
            setFsItemIndex(fsItemStartingIndex)
        } else if (document.fullscreenElement) {
            document.exitFullscreen().then(() => {
                setFsItemIndex(null)
            })
        } else {
            setFsItemIndex(null)
        }
    }, [fsItemStartingIndex])

    const exitFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen().then(() => {
                dispatch(acSetPresentDashboard(null))
            })
        }
    }

    const nextItem = useCallback(() => {
        if (fsItemIndex === sItems.current.length - 1) {
            setFsItemIndex(0)
        } else {
            setFsItemIndex(fsItemIndex + 1)
        }
        showControls()
    }, [fsItemIndex])

    const prevItem = useCallback(() => {
        if (fsItemIndex === 0) {
            setFsItemIndex(sItems.current.length - 1)
        } else {
            setFsItemIndex(fsItemIndex - 1)
        }
        showControls()
    }, [fsItemIndex])

    const showControls = () => {
        clearTimeout(hideControlsTimeout.current)

        controlsRef.current?.classList.add(classes.visible)
        hideControlsTimeout.current = setTimeout(() => {
            controlsRef.current?.classList.remove(classes.visible)
        }, 1000)
    }

    // This effect handles the keyboard navigation for the fullscreen mode
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (document.fullscreenElement) {
                if (event.key === 'ArrowRight') {
                    nextItem()
                } else if (event.key === 'ArrowLeft') {
                    prevItem()
                }
            }
        }

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                setFsItemIndex(null)
                dispatch(acSetPresentDashboard(null))
            }
        }

        // Attach the event listener to the window object
        window.addEventListener('keydown', handleKeyDown)
        document.addEventListener('fullscreenchange', handleFullscreenChange)

        document.addEventListener('mousemove', showControls)

        // Clean up the event listener when the component is unmounted
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener(
                'fullscreenchange',
                handleFullscreenChange
            )
            document.removeEventListener('mousemove', showControls)
        }
    }, [dispatch, nextItem, prevItem])

    const onToggleItemExpanded = (clickedId) => {
        const isExpanded =
            typeof expandedItems[clickedId] === 'boolean'
                ? expandedItems[clickedId]
                : false

        const newExpandedItems = { ...expandedItems }
        newExpandedItems[clickedId] = !isExpanded
        setExpandedItems(newExpandedItems)
    }

    const getItemComponent = (item) => {
        if (!layoutSm.length) {
            return <div key={item.i} />
        }

        if (firstOfTypes.includes(item.id)) {
            item.firstOfType = true
        }

        const isFS = Number.isInteger(fsItemIndex)
            ? sItems.current[fsItemIndex].id === item.id
            : null

        return (
            <ProgressiveLoadingContainer
                key={item.i}
                className={cx(
                    item.type,
                    'view',
                    getGridItemDomElementClassName(item.id),
                    {
                        [classes.hiddenItem]: isFS === false,
                        [classes.fullscreenItem]: isFS,
                    }
                )}
                itemId={item.id}
                forceLoad={forceLoad}
            >
                <Item
                    item={item}
                    gridWidth={gridWidth}
                    dashboardMode={VIEW}
                    isRecording={forceLoad}
                    onToggleItemExpanded={onToggleItemExpanded}
                    isFS={isFS}
                    sortPosition={
                        sItems.current.findIndex((i) => i.id === item.id) + 1
                    }
                />
            </ProgressiveLoadingContainer>
        )
    }

    const getItemComponents = (items) =>
        items.map((item) => getItemComponent(item))

    const onWidthChanged = (containerWidth) =>
        setTimeout(() => setGridWidth(containerWidth), 200)

    if (!dashboardItems.length) {
        return (
            <NoContentMessage
                text={i18n.t('There are no items on this dashboard')}
            />
        )
    }

    return (
        <div
            id="fullscreeen-container"
            className={cx(classes.fullscreenWrapper, {
                [classes.isFullscreenMode]: Number.isInteger(fsItemIndex),
            })}
            ref={fsElement}
        >
            <ResponsiveReactGridLayout
                className={classes.grid}
                rowHeight={GRID_ROW_HEIGHT_PX}
                width={getGridWidth(width)}
                cols={{ lg: GRID_COLUMNS, sm: SM_SCREEN_GRID_COLUMNS }}
                breakpoints={{
                    lg: getBreakpoint(),
                    sm: 0,
                }}
                layouts={{ lg: displayItems, sm: layoutSm }}
                compactType={GRID_COMPACT_TYPE}
                margin={isSmallScreen(width) ? MARGIN_SM_PX : MARGIN_PX}
                containerPadding={{
                    lg: GRID_PADDING_PX,
                    sm: GRID_PADDING_PX,
                }}
                isDraggable={false}
                isResizable={false}
                draggableCancel="input,textarea"
                onWidthChange={onWidthChanged}
            >
                {getItemComponents(displayItems)}
            </ResponsiveReactGridLayout>
            {Number.isInteger(fsItemIndex) && (
                <>
                    <div
                        className={cx(classes.fullscreenControls, {
                            [classes.visible]: true,
                        })}
                        ref={controlsRef}
                    >
                        <button onClick={prevItem}>
                            <IconChevronLeft24 color={colors.white} />
                        </button>
                        <span className={classes.pageCounter}>{`${
                            fsItemIndex + 1
                        } / ${sItems.current.length}`}</span>
                        <button onClick={nextItem}>
                            <IconChevronRight24 color={colors.white} />
                        </button>
                        <button onClick={exitFullscreen}>
                            <IconCross24 color={colors.white} />
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default ResponsiveItemGrid
