import React, { useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { Responsive as ResponsiveReactGridLayout } from 'react-grid-layout'
import { Layer, CenteredContent, CircularLoader } from '@dhis2/ui'
import cx from 'classnames'

import { acUpdateDashboardLayout } from '../../actions/editDashboard'
import { Item } from '../../components/Item/Item'
import { resize as pluginResize } from '../../components/Item/VisualizationItem/Visualization/plugin'
import { isVisualizationType } from '../../modules/itemTypes'
import {
    GRID_ROW_HEIGHT_PX,
    GRID_COMPACT_TYPE,
    MARGIN_PX,
    GRID_PADDING_PX,
    GRID_COLUMNS,
    hasShape,
    getGridWidth,
} from '../../modules/gridUtil'
import { getBreakpoint } from '../../modules/smallScreen'
import getGridItemDomId from '../../modules/getGridItemDomId'
import { orArray } from '../../modules/util'
import NoContentMessage from '../../components/NoContentMessage'
import { sGetSelectedIsLoading } from '../../reducers/selected'
import {
    sGetEditDashboardRoot,
    sGetEditDashboardItems,
} from '../../reducers/editDashboard'
import ProgressiveLoadingContainer from '../../components/Item/ProgressiveLoadingContainer'
import { EDIT } from '../../modules/dashboardModes'
import { useWindowDimensions } from '../../components/WindowDimensionsProvider'

import classes from './styles/ItemGrid.module.css'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import '../../ItemGrid.css'

const EditItemGrid = ({
    isLoading,
    dashboardItems,
    acUpdateDashboardLayout,
}) => {
    const [gridWidth, setGridWidth] = useState(0)
    const { width } = useWindowDimensions()

    const onLayoutChange = newLayout => {
        acUpdateDashboardLayout(newLayout)
    }

    const onResizeStop = (layout, oldItem, newItem) => {
        const el =
            document.querySelector(`#${getGridItemDomId(newItem.i)}`) || {}
        if (typeof el.setViewportSize === 'function')
            setTimeout(
                () =>
                    el.setViewportSize(el.clientWidth - 5, el.clientHeight - 5),
                10
            )

        const dashboardItem = dashboardItems.find(item => item.id === newItem.i)

        // call resize on the item component if it's a plugin type
        if (dashboardItem && isVisualizationType(dashboardItem)) {
            pluginResize(dashboardItem.id, dashboardItem.type)
        }
    }

    const getItemComponent = item => (
        <ProgressiveLoadingContainer
            key={item.i}
            className={cx(item.type, 'edit')}
            itemId={item.id}
        >
            <Item item={item} gridWidth={gridWidth} dashboardMode={EDIT} />
        </ProgressiveLoadingContainer>
    )

    const getItemComponents = items => items.map(item => getItemComponent(item))

    const onWidthChanged = containerWidth => {
        setTimeout(() => {
            setGridWidth(containerWidth)
        }, 200)
    }

    if (!isLoading && !dashboardItems.length) {
        return (
            <NoContentMessage
                text={i18n.t('There are no items on this dashboard')}
            />
        )
    }

    return (
        <>
            {isLoading ? (
                <Layer translucent>
                    <CenteredContent>
                        <CircularLoader />
                    </CenteredContent>
                </Layer>
            ) : null}
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
                onResizeStop={onResizeStop}
                onWidthChange={onWidthChanged}
                isDraggable={true}
                isResizable={true}
                draggableCancel="input,textarea"
            >
                {getItemComponents(dashboardItems)}
            </ResponsiveReactGridLayout>
        </>
    )
}

EditItemGrid.propTypes = {
    acUpdateDashboardLayout: PropTypes.func,
    dashboardItems: PropTypes.array,
    isLoading: PropTypes.bool,
}

// Container

const mapStateToProps = state => {
    const selectedDashboard = sGetEditDashboardRoot(state)
    const dashboardItems = orArray(sGetEditDashboardItems(state)).filter(
        hasShape
    )

    return {
        isLoading: sGetSelectedIsLoading(state) || !selectedDashboard,
        dashboardItems,
    }
}

const mapDispatchToProps = {
    acUpdateDashboardLayout,
}

export default connect(mapStateToProps, mapDispatchToProps)(EditItemGrid)
