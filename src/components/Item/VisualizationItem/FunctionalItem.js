import React, { useState, useEffect, useMemo, createRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import uniqueId from 'lodash/uniqueId'

import VisualizationPlugin from './Plugin/VisualizationPlugin'
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
import memoizeOne from '../../../modules/memoizeOne'
import {
    isEditMode,
    isPrintMode,
    isViewMode,
} from '../../Dashboard/dashboardModes'

import { ITEM_CONTENT_PADDING_BOTTOM } from '../../ItemGrid/ItemGrid'

const Item = props => {
    const [showFooter, setShowFooter] = useState(false)
    const [configLoaded, setConfigLoaded] = useState(false)
    const [calculatedHeight, setCalculatedHeight] = useState(null)
    const [preferMeasured, setPreferMeasured] = useState(
        isEditMode(props.dashboardMode) || isPrintMode(props.dashboardMode)
    )
    const [measuredHeight, setMeasuredHeight] = useState(null)
    // const [isFullscreen, setIsFullscreen] = useState(false)

    let contentRef = createRef()
    const headerRef = createRef()
    const itemRef = createRef()

    const memoizedGetVisualizationConfig = useMemo(getVisualizationConfig)

    // componentDidMount
    useEffect(async () => {
        props.updateVisualization(await apiFetchVisualization(props.item))
        setConfigLoaded(true)
    })

    // componentDidUpdate
    /*
    useEffect(() => {
    if (
        prevState.pluginIsLoaded &&
        (prevProps.visualization !== this.props.visualization ||
            prevProps.itemFilters !== this.props.itemFilters)
    ) {
        setPluginIsLoaded(false)
    }
    }, [pluginIsLoaded, props.visualization, props.itemFilters])
    */

    const getUniqueKey = useMemo(() => uniqueId())

    const onToggleFooter = () => {
        setShowFooter(!showFooter)
        props.onToggleItemExpanded(props.item.id)
    }

    const onToggleFullscreen = () => {}

    const selectActiveType = type => {
        type !== getActiveType() && props.selectActiveType(props.item.id, type)
    }

    const getActiveType = () => {
        if (props.isEditing) {
            return props.item.type
        }
        return props.activeType || props.item.type
    }

    const memoizedGetContentHeight = useMemo(() => {
        const height = preferMeasured
            ? measuredHeight || calculatedHeight
            : calculatedHeight

        return { height }
    }, [calculatedHeight, measuredHeight, preferMeasured])

    const getPluginStyle = () => {
        setCalculatedHeight(
            props.item.originalHeight -
                headerRef.current.clientHeight -
                HEADER_MARGIN_HEIGHT -
                ITEM_CONTENT_PADDING_BOTTOM
        )
        setMeasuredHeight(contentRef ? contentRef.offsetHeight : null)

        return memoizedGetContentHeight()
    }

    const { item, dashboardMode, itemFilters } = props

    const actionButtons = (
        <ItemHeaderButtons
            item={item}
            visualization={props.visualization}
            onSelectActiveType={selectActiveType}
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
                    {configLoaded && (
                        <VisualizationPlugin
                            activeType={getActiveType()}
                            visualization={memoizedGetVisualizationConfig(
                                props.visualization,
                                props.item.type,
                                getActiveType()
                            )}
                            style={getPluginStyle()}
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
    selectActiveType: PropTypes.func,
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
    const itemFilters = !isEditMode(ownProps.dashboardMode)
        ? sGetItemFiltersRoot(state)
        : DEFAULT_STATE_ITEM_FILTERS

    return {
        activeType: sGetSelectedItemActiveType(state, ownProps.item?.id),
        isEditing: sGetIsEditing(state),
        itemFilters,
        visualization: sGetVisualization(
            state,
            getVisualizationId(ownProps.item)
        ),
    }
}

const mapDispatchToProps = {
    selectActiveType: acSetSelectedItemActiveType,
    updateVisualization: acAddVisualization,
}

export default connect(mapStateToProps, mapDispatchToProps)(Item)
