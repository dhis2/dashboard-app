import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import ReactGridLayout from 'react-grid-layout'
import { Layer, CenteredContent, CircularLoader } from '@dhis2/ui'
import sortBy from 'lodash/sortBy'

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
import { itemTypeMap, PAGEBREAK } from '../../modules/itemTypes'

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
        const itemClassNames = [item.type, 'print', 'layout'].join(' ')

        return (
            <div key={item.i} className={itemClassNames}>
                <Item item={item} dashboardMode={PRINT_LAYOUT} />
            </div>
        )
    }

    getItemComponents = items => items.map(item => this.getItemComponent(item))

    hideExtraPageBreaks() {
        const elements = Array.from(
            document.querySelectorAll('.react-grid-item')
        )

        const types = Object.keys(itemTypeMap)
        const items = elements.map(el => {
            const classNames = el.className.split(' ')

            const type = classNames.find(
                className => types.indexOf(className) > -1
            )

            const rect = el.getBoundingClientRect()

            return {
                type,
                el,
                y: rect.y,
                h: rect.height,
            }
        })
        const sortedItems = sortBy(items, ['y'])

        let pageBreakBottom = 0
        let lastItemBottom = 0
        let foundNonPageBreak = false

        for (let i = sortedItems.length - 1; i >= 0; --i) {
            const item = sortedItems[i]
            if (item.type === PAGEBREAK) {
                if (!foundNonPageBreak) {
                    item.el.classList.add('removed')
                } else {
                    const y = item.el.style.transform
                        ? item.el.style.transform.split(' ')[1].slice(0, -3)
                        : item.y

                    pageBreakBottom = parseInt(y) + parseInt(item.h)
                    break
                }
            } else {
                foundNonPageBreak = true
                const y = item.el.style.transform
                    ? item.el.style.transform.split(' ')[1].slice(0, -3)
                    : item.y

                const thisItemBottom = parseInt(y) + parseInt(item.h)
                if (thisItemBottom > lastItemBottom) {
                    lastItemBottom = thisItemBottom
                }
            }
        }

        const pageHeight = 720
        const gridElement = document.querySelector('.react-grid-layout')
        const maxHeight = pageBreakBottom + pageHeight

        if (maxHeight < lastItemBottom) {
            // there is a problem - this should not happen
            console.log('jj PROBLEM! items extend beyond page bottom')
        }
        if (gridElement) {
            gridElement.style.height = `${maxHeight}px`
        }
    }

    componentDidMount() {
        this.hideExtraPageBreaks()
    }

    componentDidUpdate() {
        this.hideExtraPageBreaks()
    }

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
