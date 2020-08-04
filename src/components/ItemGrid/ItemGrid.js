import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import ReactGridLayout from 'react-grid-layout'
import { Layer, CenteredContent, CircularLoader } from '@dhis2/ui'

import PageBreakRuler from './PageBreakRuler'
import NoContentMessage from '../../widgets/NoContentMessage'
import {
    GRID_ROW_HEIGHT,
    GRID_COMPACT_TYPE,
    MARGIN,
    getGridColumns,
} from '../../modules/gridUtil'
import { getNumPrintPages } from '../../modules/printUtils'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import './ItemGrid.css'

// this is set in the .dashboard-item-content css
export const ITEM_CONTENT_PADDING_BOTTOM = 4

const getPageBreakRuler = layout => {
    // TODO: fix bc it mutates the array items due to sorting
    const pageCount = getNumPrintPages(layout)

    return <PageBreakRuler pageCount={pageCount} />
}

const ItemGrid = ({
    isLoading,
    isEditable,
    width,
    layout,
    classNames,
    children,
    includePageBreakRuler,
    onLayoutChange,
    onResizeStop,
}) => {
    if (!isLoading && !layout.length) {
        return (
            <NoContentMessage
                text={i18n.t('There are no items on this dashboard')}
            />
        )
    }

    return (
        <div className="grid-wrapper">
            {isLoading ? (
                <Layer translucent>
                    <CenteredContent>
                        <CircularLoader />
                    </CenteredContent>
                </Layer>
            ) : null}
            {includePageBreakRuler && getPageBreakRuler(layout)}
            <ReactGridLayout
                onLayoutChange={onLayoutChange}
                onResizeStop={onResizeStop}
                className={classNames}
                layout={layout}
                margin={MARGIN}
                cols={getGridColumns()}
                rowHeight={GRID_ROW_HEIGHT}
                width={width}
                compactType={GRID_COMPACT_TYPE}
                isDraggable={isEditable}
                isResizable={isEditable}
                draggableCancel="input,textarea"
            >
                {children}
            </ReactGridLayout>
        </div>
    )
}

ItemGrid.propTypes = {
    children: PropTypes.node,
    classNames: PropTypes.string,
    includePageBreakRuler: PropTypes.bool,
    isEditable: PropTypes.bool,
    isLoading: PropTypes.bool,
    layout: PropTypes.array,
    width: PropTypes.number,
    onLayoutChange: PropTypes.func,
    onResizeStop: PropTypes.func,
}

ItemGrid.defaultProps = {
    dashboardItems: [],
    onLayoutChange: Function.prototype,
    onResizeStop: Function.prototype,
    includePageBreakRuler: false,
}

export default ItemGrid
