import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import ReactGridLayout from 'react-grid-layout'
import { Layer, CenteredContent, CircularLoader } from '@dhis2/ui'

import { Item } from '../Item/Item'
import NoContentMessage from '../../widgets/NoContentMessage'

import { sGetSelectedIsLoading } from '../../reducers/selected'
import {
    sGetEditDashboardRoot,
    sGetEditDashboardItems,
} from '../../reducers/editDashboard'

import {
    GRID_ROW_HEIGHT,
    GRID_COMPACT_TYPE,
    MARGIN,
    getGridColumns,
    hasShape,
    getItemPageColumns,
    getItemPageHeightRows,
} from './gridUtil'
import { orArray } from '../../modules/util'

import 'react-grid-layout/css/styles.css'

import './ItemGrid.css'

export class ItemGrid extends Component {
    getItemComponent = item => {
        const itemClassNames = [item.type, 'edit'].join(' ')

        // TODO: this mutates the redux store
        item.w = getItemPageColumns(1102)
        item.h = getItemPageHeightRows(700)

        return (
            <div key={item.i} className={itemClassNames}>
                <Item item={item} editMode={true} />
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

        //sorting the items is so that the print, with one item per page
        //prints in the order of top to bottom of the dashboard
        const sortedItems = dashboardItems.sort((a, b) => {
            if (a.y < b.y) {
                return -2
            } else if (a.y === b.y) {
                if (a.x < b.x) {
                    return -1
                }
            }

            return 1
        })

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
                    className="layout print printview"
                    layout={sortedItems}
                    margin={MARGIN}
                    cols={getGridColumns()}
                    rowHeight={GRID_ROW_HEIGHT}
                    width={window.innerWidth}
                    compactType={GRID_COMPACT_TYPE}
                    isDraggable={false}
                    isResizable={false}
                    draggableCancel="input,textarea"
                >
                    {this.getItemComponents(sortedItems)}
                </ReactGridLayout>
            </div>
        )
    }
}

ItemGrid.propTypes = {
    dashboardItems: PropTypes.array,
    isLoading: PropTypes.bool,
}

ItemGrid.defaultProps = {
    dashboardItems: [],
}

// Container

const mapStateToProps = state => {
    const selectedDashboard = sGetEditDashboardRoot(state)

    const dashboardItems = sGetEditDashboardItems(state)

    return {
        isLoading: sGetSelectedIsLoading(state) || !selectedDashboard,
        dashboardItems,
    }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const validItems = orArray(stateProps.dashboardItems).filter(hasShape)

    return {
        ...dispatchProps,
        edit: ownProps.edit,
        isLoading: stateProps.isLoading,
        dashboardItems: validItems,
    }
}

export default connect(mapStateToProps, null, mergeProps)(ItemGrid)
