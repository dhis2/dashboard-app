import React, { useState, useEffect, useMemo, createRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import DVPlugin from '@dhis2/data-visualizer-plugin'
import i18n from '@dhis2/d2-i18n'
import DefaultPlugin from './DefaultPlugin'
import MapPlugin from './MapPlugin'
import LoadingMask from '../LoadingMask'
import NoVisualizationMessage from './NoVisualizationMessage'
import {
    VISUALIZATION,
    MAP,
    CHART,
    REPORT_TABLE,
} from '../../../../modules/itemTypes'
import getFilteredVisualization from './getFilteredVisualization'

const VisualizationPlugin = (
    { activeType, visualization, style, item, itemFilters },
    context
) => {
    if (!visualization) {
        return <NoVisualizationMessage message={i18n.t('No data to display')} />
    }

    const memoizedGetFilteredVis = useMemo(getFilteredVisualization)
    const [pluginIsLoaded, setPluginIsLoaded] = useState(false)
    const theprops = {
        item: item,
        itemFilters: itemFilters,
        activeType,
        visualization,
        style: style,
    }

    const onLoadingComplete = () => setPluginIsLoaded(true)

    switch (activeType) {
        case VISUALIZATION:
        case CHART:
        case REPORT_TABLE: {
            return (
                <>
                    {!pluginIsLoaded && (
                        <div style={theprops.style}>
                            <LoadingMask />
                        </div>
                    )}
                    <DVPlugin
                        d2={context.d2}
                        visualization={memoizedGetFilteredVis(
                            visualization,
                            theprops.itemFilters
                        )}
                        onLoadingComplete={onLoadingComplete}
                        forDashboard={true}
                        style={theprops.style}
                    />
                </>
            )
        }
        case MAP: {
            return (
                <MapPlugin
                    getFilteredVisualization={memoizedGetFilteredVis}
                    {...theprops}
                />
            )
        }
        default: {
            theprops.visualization = memoizedGetFilteredVis(
                theprops.visualization,
                theprops.itemFilters
            )

            return <DefaultPlugin {...theprops} />
        }
    }
}

VisualizationPlugin.contextTypes = {
    d2: PropTypes.object,
}

VisualizationPlugin.propTypes = {
    activeType: PropTypes.string,
    dashboardMode: PropTypes.string,
    isEditing: PropTypes.bool,
    item: PropTypes.object,
    itemFilters: PropTypes.object,
    selectActiveType: PropTypes.func,
    updateVisualization: PropTypes.func,
    visualization: PropTypes.object,
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

export default connect(mapStateToProps, mapDispatchToProps)(VisualizationPlugin)
