import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import ReactGridLayout from 'react-grid-layout'
import { Layer, CenteredContent, CircularLoader } from '@dhis2/ui'

import { acUpdateDashboardLayout } from '../../actions/editDashboard'
import { Item } from '../Item/Item'
import {
    GRID_ROW_HEIGHT,
    GRID_COMPACT_TYPE,
    MARGIN,
    getGridColumns,
    hasShape,
} from './gridUtil'
import { orArray } from '../../modules/util'
import { a4LandscapeWidthPx } from '../../modules/printUtils'
import { PRINT_LAYOUT } from '../Dashboard/dashboardModes'

import NoContentMessage from '../../widgets/NoContentMessage'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import './ItemGrid.css'
import { sGetSelectedIsLoading } from '../../reducers/selected'
import {
    sGetEditDashboardRoot,
    sGetEditDashboardItems,
} from '../../reducers/editDashboard'

// this is set in the .dashboard-item-content css
export const ITEM_CONTENT_PADDING_BOTTOM = 4

export class PrintLayoutItemGrid extends Component {
    onLayoutChange = newLayout => {
        this.props.acUpdateDashboardLayout(newLayout)
    }

    getItemComponent = item => {
        const itemClassNames = [item.type, 'print'].join(' ')

        return (
            <div key={item.i} className={itemClassNames}>
                <Item item={item} dashboardMode={PRINT_LAYOUT} />
            </div>
        )
    }

    getItemComponents = items => items.map(item => this.getItemComponent(item))

    render() {
        const { isLoading, dashboardItems } = this.props

        if (!isLoading && !dashboardItems.length) {
            return (
                <NoContentMessage
                    text={i18n.t('There are no items on this dashboard')}
                />
            )
        }

        const width =
            a4LandscapeWidthPx < window.innerWidth
                ? a4LandscapeWidthPx
                : window.innerWidth

        return (
            <div className="grid-wrapper">
                {isLoading ? (
                    <Layer translucent>
                        <CenteredContent>
                            <CircularLoader />
                        </CenteredContent>
                    </Layer>
                ) : null}
                <ReactGridLayout
                    onLayoutChange={this.onLayoutChange}
                    className="layout"
                    layout={dashboardItems}
                    margin={MARGIN}
                    cols={getGridColumns()}
                    rowHeight={GRID_ROW_HEIGHT}
                    width={width}
                    compactType={GRID_COMPACT_TYPE}
                    isDraggable={false}
                    isResizable={false}
                    draggableCancel="input,textarea"
                >
                    {this.getItemComponents(dashboardItems)}
                </ReactGridLayout>
            </div>
        )
    }
}

PrintLayoutItemGrid.propTypes = {
    acUpdateDashboardLayout: PropTypes.func,
    dashboardItems: PropTypes.array,
    isLoading: PropTypes.bool,
}

PrintLayoutItemGrid.defaultProps = {
    dashboardItems: [],
}

const mapStateToProps = state => {
    const selectedDashboard = sGetEditDashboardRoot(state)

    return {
        isLoading: sGetSelectedIsLoading(state) || !selectedDashboard,
        dashboardItems: orArray(sGetEditDashboardItems(state)).filter(hasShape),
    }
}

const mapDispatchToProps = {
    acUpdateDashboardLayout,
}

export default connect(mapStateToProps, mapDispatchToProps)(PrintLayoutItemGrid)
