import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import ReactGridLayout from 'react-grid-layout'
import { Layer, CenteredContent, CircularLoader } from '@dhis2/ui'
import cx from 'classnames'

import { acUpdateDashboardLayout } from '../../actions/editDashboard'
import { Item } from '../Item/Item'
import { resize as pluginResize } from '../Item/VisualizationItem/Visualization/plugin'
import { isVisualizationType } from '../../modules/itemTypes'
import {
    GRID_ROW_HEIGHT,
    GRID_COMPACT_TYPE,
    MARGIN,
    getGridColumns,
    hasShape,
    getGridItemDomId,
} from './gridUtil'
import { orArray } from '../../modules/util'
import NoContentMessage from '../../widgets/NoContentMessage'
import { sGetSelectedIsLoading } from '../../reducers/selected'
import {
    sGetEditDashboardRoot,
    sGetEditDashboardItems,
} from '../../reducers/editDashboard'
import ProgressiveLoadingContainer from '../Item/ProgressiveLoadingContainer'
import { EDIT } from '../Dashboard/dashboardModes'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './styles/ItemGrid.css'

const EditItemGrid = ({
    isLoading,
    dashboardItems,
    acUpdateDashboardLayout,
}) => {
    const onLayoutChange = newLayout => {
        acUpdateDashboardLayout(newLayout)
    }

    const onItemResize = id => {
        const el = document.querySelector(`#${getGridItemDomId(id)}`) || {}
        if (typeof el.setViewportSize === 'function')
            setTimeout(
                () =>
                    el.setViewportSize(el.clientWidth - 5, el.clientHeight - 5),
                10
            )
    }

    const onResizeStop = (layout, oldItem, newItem) => {
        onItemResize(newItem.i)

        const dashboardItem = dashboardItems.find(item => item.id === newItem.i)

        // call resize on the item component if it's a plugin type
        if (dashboardItem && isVisualizationType(dashboardItem)) {
            pluginResize(dashboardItem)
        }
    }

    const getItemComponent = item => (
        <ProgressiveLoadingContainer
            key={item.i}
            className={cx(item.type, 'edit')}
            itemId={item.id}
        >
            <Item item={item} dashboardMode={EDIT} />
        </ProgressiveLoadingContainer>
    )

    const getItemComponents = items => items.map(item => getItemComponent(item))

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
            <ReactGridLayout
                layout={dashboardItems}
                margin={MARGIN}
                cols={getGridColumns()}
                rowHeight={GRID_ROW_HEIGHT}
                width={window.innerWidth}
                compactType={GRID_COMPACT_TYPE}
                onLayoutChange={onLayoutChange}
                onResizeStop={onResizeStop}
                isDraggable={true}
                isResizable={true}
                draggableCancel="input,textarea"
            >
                {getItemComponents(dashboardItems)}
            </ReactGridLayout>
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
