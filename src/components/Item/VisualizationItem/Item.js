import React, { useState, useEffect, useCallback, createRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import uniqueId from 'lodash/uniqueId'

import Visualization from './Plugin/Visualization'
import FatalErrorBoundary from './FatalErrorBoundary'
// import FullscreenItem from './FullscreenItem'
import ItemHeader, { HEADER_MARGIN_HEIGHT } from '../ItemHeader/ItemHeader'
import ItemHeaderButtons from './ItemHeaderButtons'
import ItemFooter from './ItemFooter'

import { apiFetchVisualization } from '../../../api/metadata'
import getVisualizationConfig from './getVisualizationConfig'
import { sGetVisualization } from '../../../reducers/visualizations'
import { sGetSelectedItemActiveType } from '../../../reducers/selected'
import { sGetIsEditing } from '../../../reducers/editDashboard'
import {
    sGetItemFiltersRoot,
    DEFAULT_STATE_ITEM_FILTERS,
} from '../../../reducers/itemFilters'
import { acAddVisualization } from '../../../actions/visualizations'
import { acSetSelectedItemActiveType } from '../../../actions/selected'
import { getVisualizationId, getVisualizationName } from '../../../modules/item'

import {
    isEditMode,
    isPrintMode,
    isViewMode,
} from '../../Dashboard/dashboardModes'

import { ITEM_CONTENT_PADDING_BOTTOM } from '../../ItemGrid/ItemGrid'

const Item = props => {
    const { item, dashboardMode, itemFilters } = props

    const [showFooter, setShowFooter] = useState(false)
    const [visualizationLoaded, setVisualizationLoaded] = useState(false)
    const [calculatedHeight, setCalculatedHeight] = useState(null)
    const [measuredHeight, setMeasuredHeight] = useState(null)
    // const [isFullscreen, setIsFullscreen] = useState(false)

    let contentRef = createRef()
    const headerRef = createRef()
    const itemRef = createRef()
    const preferMeasured =
        isEditMode(dashboardMode) || isPrintMode(dashboardMode)

    const memoizedGetVisualizationConfig = useCallback(getVisualizationConfig, [
        props.visualization,
        item.type,
        props.activeType,
    ])

    useEffect(() => {
        let isSubscribed = true
        apiFetchVisualization(item).then(vis => {
            if (isSubscribed) {
                props.updateVisualization(vis)
                setVisualizationLoaded(true)
            }
        })

        return () => (isSubscribed = false)
    }, [])

    useEffect(() => {
        headerRef.current &&
            setCalculatedHeight(
                item.originalHeight -
                    headerRef.current.clientHeight -
                    HEADER_MARGIN_HEIGHT -
                    ITEM_CONTENT_PADDING_BOTTOM
            )
    }, [item, headerRef])

    useEffect(() => {
        setMeasuredHeight(contentRef ? contentRef.offsetHeight : null)
    }, [contentRef])

    const getUniqueKey = useCallback(() => uniqueId())

    const onToggleFooter = () => {
        setShowFooter(!showFooter)
        props.onToggleItemExpanded(item.id)
    }

    const onToggleFullscreen = () => {}

    const setActiveType = type =>
        type !== getActiveType() && props.setActiveType(item.id, type)

    const getActiveType = () => {
        if (props.isEditing) {
            return item.type
        }
        return props.activeType || item.type
    }

    const memoizedGetContentHeight = useCallback(() => {
        return preferMeasured
            ? measuredHeight || calculatedHeight
            : calculatedHeight
    }, [calculatedHeight, measuredHeight, preferMeasured])

    const actionButtons = (
        <ItemHeaderButtons
            item={item}
            visualization={props.visualization}
            onSelectActiveType={setActiveType}
            onToggleFooter={onToggleFooter}
            onToggleFullscreen={onToggleFullscreen}
            activeType={getActiveType()}
            activeFooter={showFooter}
        />
    )

    return (
        <div ref={itemRef}>
            <ItemHeader
                title={getVisualizationName(item)}
                itemId={item.id}
                actionButtons={actionButtons}
                ref={headerRef}
                dashboardMode={dashboardMode}
                isShortened={item.shortened}
            />
            <FatalErrorBoundary>
                <div
                    key={getUniqueKey(itemFilters)}
                    className="dashboard-item-content"
                    ref={ref => (contentRef = ref)}
                >
                    {visualizationLoaded && (
                        <Visualization
                            item={item}
                            itemFilters={itemFilters}
                            activeType={getActiveType()}
                            visualization={memoizedGetVisualizationConfig(
                                props.visualization,
                                item.type,
                                getActiveType()
                            )}
                            availableHeight={memoizedGetContentHeight()}
                        />
                    )}
                </div>
            </FatalErrorBoundary>
            {isViewMode(dashboardMode) && showFooter ? (
                <ItemFooter item={item} />
            ) : null}
        </div>
    )
}

Item.propTypes = {
    activeType: PropTypes.string,
    dashboardMode: PropTypes.string,
    isEditing: PropTypes.bool,
    item: PropTypes.object,
    itemFilters: PropTypes.object,
    setActiveType: PropTypes.func,
    updateVisualization: PropTypes.func,
    visualization: PropTypes.object,
    onToggleItemExpanded: PropTypes.func,
}

Item.defaultProps = {
    item: {},
    onToggleItemExpanded: Function.prototype,
    visualization: {},
}

const mapStateToProps = (state, ownProps) => {
    return {
        activeType: sGetSelectedItemActiveType(state, ownProps.item?.id),
        isEditing: sGetIsEditing(state),
        itemFilters: !isEditMode(ownProps.dashboardMode)
            ? sGetItemFiltersRoot(state)
            : DEFAULT_STATE_ITEM_FILTERS,
        visualization: sGetVisualization(
            state,
            getVisualizationId(ownProps.item)
        ),
    }
}

const mapDispatchToProps = {
    setActiveType: acSetSelectedItemActiveType,
    updateVisualization: acAddVisualization,
}

export default connect(mapStateToProps, mapDispatchToProps)(Item)
