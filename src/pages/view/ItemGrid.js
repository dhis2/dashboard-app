import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import sortBy from 'lodash/sortBy.js'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Responsive as ResponsiveReactGridLayout } from 'react-grid-layout'
import { useDispatch, useSelector } from 'react-redux'
import { acSetPresentDashboard } from '../../actions/presentDashboard.js'
import { Item } from '../../components/Item/Item.js'
import { getGridItemElement } from '../../components/Item/VisualizationItem/getGridItemElement.js'
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
        const sortedItems = sortBy(displayItems, ['y', 'x'])
        // TODO - remove the spacer and message items
        sItems.current = sortedItems
    }, [displayItems])

    // Handle Present button or Item Fullscreen button clicked
    useEffect(() => {
        if (Number.isInteger(fsItemStartingIndex)) {
            // const el = getGridItemElement(
            //     sItems.current[fsItemStartingIndex].id
            // )
            const el = fsElement?.current
            console.log('jj set starting fs element', el)
            el?.requestFullscreen()
            setFsItemIndex(fsItemStartingIndex)
        } else {
            console.log('jj document.exitFS here')
            document.exitFullscreen().then(() => {
                setFsItemIndex(null)
            })
        }
    }, [fsItemStartingIndex])

    const exitFullscreen = () => {
        if (document.fullscreenElement) {
            console.log('jj document.exitFullscreen')
            document.exitFullscreen().then(() => {
                dispatch(acSetPresentDashboard(null))
            })
        }
    }

    const nextItem = useCallback(() => {
        // const el = fsElement.current
        if (fsItemIndex === sItems.current.length - 1) {
            // const el = getGridItemElement(sItems.current[0].id)
            // el?.requestFullscreen().then(() => {
            setFsItemIndex(0)
            // })
        } else {
            // const el = getGridItemElement(sItems.current[fsItemIndex + 1].id)
            // el?.requestFullscreen().then(() => {
            setFsItemIndex(fsItemIndex + 1)
            // })
        }
    }, [fsItemIndex])

    const prevItem = useCallback(() => {
        // const el = fsElement.current
        if (fsItemIndex === 0) {
            // const el = getGridItemElement(
            //     sItems.current[sItems.current.length - 1].id
            // )
            // el?.requestFullscreen().then(() => {
            setFsItemIndex(sItems.current.length - 1)
            // })
        } else {
            // const el = getGridItemElement(sItems.current[fsItemIndex - 1].id)
            // el.requestFullscreen().then(() => {
            setFsItemIndex(fsItemIndex - 1)
            // })
        }
    }, [fsItemIndex])

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
            console.log('jj handleFullscreenChange', document.fullscreenElement)
            if (!document.fullscreenElement) {
                setFsItemIndex(null)
                dispatch(acSetPresentDashboard(null))
            }
        }

        // Attach the event listener to the window object
        window.addEventListener('keydown', handleKeyDown)
        document.addEventListener('fullscreenchange', handleFullscreenChange)

        // Clean up the event listener when the component is unmounted
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener(
                'fullscreenchange',
                handleFullscreenChange
            )
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

        return (
            <ProgressiveLoadingContainer
                key={item.i}
                className={cx(
                    item.type,
                    'view',
                    getGridItemDomElementClassName(item.id)
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
                    // isFS={
                    //     !!(
                    //         Number.isInteger(fsItemIndex) &&
                    //         sItems.current[fsItemIndex]?.id === item.id
                    //     )
                    // }
                    sortPosition={
                        sItems.current.findIndex((i) => i.id === item.id) + 1
                    }
                    numSortItems={sItems.current.length}
                    nextItem={nextItem}
                    prevItem={prevItem}
                    exitFullscreen={exitFullscreen}
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

    console.log('jj render ItemGrid with fsItemIndex:', fsItemIndex)

    return (
        <div
            id="fullscreeen-container"
            className={classes.fullscreenWrapper}
            ref={fsElement}
        >
            {Number.isInteger(fsItemIndex) ? (
                <>
                    <span>Fullscreen container</span>
                    <div className={classes.fullscreenContainer}>
                        {getItemComponent(sItems.current[fsItemIndex])}
                    </div>
                    <div className={classes.fullscreenNav}>
                        <button onClick={prevItem}>Prev</button>
                        <button onClick={nextItem}>Next</button>
                        <button onClick={exitFullscreen}>Exit</button>
                    </div>
                </>
            ) : (
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
            )}
        </div>
    )
}

export default ResponsiveItemGrid
