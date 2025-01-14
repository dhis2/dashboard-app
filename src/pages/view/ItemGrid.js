import { useCachedDataQuery } from '@dhis2/analytics'
import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useRef } from 'react'
import { Responsive as ResponsiveReactGridLayout } from 'react-grid-layout'
import { useSelector } from 'react-redux'
import { useContainerWidth } from '../../components/DashboardContainer.js'
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
    getProportionalHeight,
} from '../../modules/gridUtil.js'
import { getBreakpoint, isSmallScreen } from '../../modules/smallScreen.js'
import { useCacheableSection } from '../../modules/useCacheableSection.js'
import {
    sGetSelectedId,
    sGetSelectedDashboardItems,
} from '../../reducers/selected.js'
import SlideshowControlbar from './SlideshowControlbar.js'
import classes from './styles/ItemGrid.module.css'
import useSlideshow from './useSlideshow.js'

const EXPANDED_HEIGHT = 19
const EXPANDED_HEIGHT_SM = 15

const ResponsiveItemGrid = ({ dashboardIsCached }) => {
    const dashboardId = useSelector(sGetSelectedId)
    const dashboardItems = useSelector(sGetSelectedDashboardItems)
    const { width } = useWindowDimensions()
    const containerWidth = useContainerWidth()
    const { apps } = useCachedDataQuery()
    const [expandedItems, setExpandedItems] = useState({})
    const [displayItems, setDisplayItems] = useState(dashboardItems)
    const [layoutSm, setLayoutSm] = useState([])
    const [gridWidth, setGridWidth] = useState(0)
    const [forceLoad, setForceLoad] = useState(false)
    const { recordingState } = useCacheableSection(dashboardId)
    const { isDisconnected: isOffline } = useDhis2ConnectionStatus()
    const firstOfTypes = getFirstOfTypes(dashboardItems)
    const slideshowElementRef = useRef(null)

    const {
        slideshowItemIndex,
        sortedItems,
        isEnteringSlideshow,
        exitSlideshow,
        nextItem,
        prevItem,
    } = useSlideshow(displayItems, slideshowElementRef)

    const isSlideshowView = slideshowItemIndex !== null

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

        const itemIsFullscreen = isSlideshowView
            ? sortedItems[slideshowItemIndex].id === item.id
            : null

        // Force load next and previous items for slideshow view
        const nextslideshowItemIndex =
            slideshowItemIndex === sortedItems.length - 1
                ? 0
                : slideshowItemIndex + 1
        const prevslideshowItemIndex =
            slideshowItemIndex === 0
                ? sortedItems.length - 1
                : slideshowItemIndex - 1

        const itemIsNextPrevFullscreen =
            isSlideshowView &&
            (sortedItems[nextslideshowItemIndex].id === item.id ||
                sortedItems[prevslideshowItemIndex].id === item.id)

        return (
            <ProgressiveLoadingContainer
                key={item.i}
                className={cx(
                    item.type,
                    'view',
                    getGridItemDomElementClassName(item.id),
                    {
                        [classes.fullscreenItem]:
                            isEnteringSlideshow || isSlideshowView,
                        [classes.hiddenItem]: itemIsFullscreen === false,
                        [classes.displayedItem]: itemIsFullscreen,
                        [classes.enteringFullscreen]: isEnteringSlideshow,
                    }
                )}
                item={item}
                forceLoad={
                    forceLoad || itemIsFullscreen || itemIsNextPrevFullscreen
                }
                fullscreenView={isSlideshowView}
                isOffline={isOffline}
                dashboardIsCached={dashboardIsCached}
                apps={apps}
            >
                <Item
                    item={item}
                    gridWidth={gridWidth}
                    dashboardMode={VIEW}
                    isRecording={forceLoad}
                    onToggleItemExpanded={onToggleItemExpanded}
                    isFullscreen={itemIsFullscreen}
                    sortIndex={sortedItems.findIndex((i) => i.id === item.id)}
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
            className={cx({ [classes.slideshowContainer]: isSlideshowView })}
            ref={slideshowElementRef}
        >
            <ResponsiveReactGridLayout
                className={cx(classes.grid, {
                    [classes.slideshowGrid]: isSlideshowView,
                })}
                rowHeight={GRID_ROW_HEIGHT_PX}
                width={containerWidth}
                cols={{ lg: GRID_COLUMNS, sm: SM_SCREEN_GRID_COLUMNS }}
                breakpoints={{
                    lg: getBreakpoint(containerWidth),
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
            {isSlideshowView && !isEnteringSlideshow && (
                <SlideshowControlbar
                    slideshowItemIndex={slideshowItemIndex}
                    exitSlideshow={exitSlideshow}
                    nextItem={nextItem}
                    prevItem={prevItem}
                    numItems={sortedItems.length}
                />
            )}
        </div>
    )
}

ResponsiveItemGrid.propTypes = {
    dashboardIsCached: PropTypes.bool,
}

export default ResponsiveItemGrid
