import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import ReactGridLayout from 'react-grid-layout'
import { Layer, CenteredContent, CircularLoader } from '@dhis2/ui'
import cx from 'classnames'

import { Item } from '../Item/Item'
import NoContentMessage from '../../widgets/NoContentMessage'

import { PRINT } from '../Dashboard/dashboardModes'
import { sGetSelectedIsLoading } from '../../reducers/selected'
import {
    sGetPrintDashboardRoot,
    sGetPrintDashboardItems,
} from '../../reducers/printDashboard'

import {
    GRID_ROW_HEIGHT,
    GRID_COMPACT_TYPE,
    MARGIN,
    getGridColumns,
    hasShape,
} from './gridUtil'
import { a4LandscapeWidthPx } from '../../modules/printUtils'
import { orArray } from '../../modules/util'

import 'react-grid-layout/css/styles.css'

import './ItemGrid.css'

export class PrintItemGrid extends Component {
    getItemComponent = item => (
        <div key={item.i} className={cx(item.type, 'print', 'oipp')}>
            <Item item={item} dashboardMode={PRINT} />
        </div>
    )

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
            <>
                {isLoading ? (
                    <Layer translucent>
                        <CenteredContent>
                            <CircularLoader />
                        </CenteredContent>
                    </Layer>
                ) : null}
                <ReactGridLayout
                    className="layout print"
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
            </>
        )
    }
}

PrintItemGrid.propTypes = {
    dashboardItems: PropTypes.array,
    isLoading: PropTypes.bool,
}

PrintItemGrid.defaultProps = {
    dashboardItems: [],
}

const mapStateToProps = state => {
    const selectedDashboard = sGetPrintDashboardRoot(state)

    return {
        isLoading: sGetSelectedIsLoading(state) || !selectedDashboard,
        dashboardItems: orArray(sGetPrintDashboardItems(state)).filter(
            hasShape
        ),
    }
}

export default connect(mapStateToProps)(PrintItemGrid)
