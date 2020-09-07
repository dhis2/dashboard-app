import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import sortBy from 'lodash/sortBy'
import ReactGridLayout from 'react-grid-layout'
import { Layer, CenteredContent, CircularLoader } from '@dhis2/ui'
import cx from 'classnames'

import { Item } from '../Item/Item'
import NoContentMessage from '../../widgets/NoContentMessage'

import { acUpdatePrintDashboardLayout } from '../../actions/printDashboard'
import { sGetSelectedIsLoading } from '../../reducers/selected'
import {
    sGetPrintDashboardRoot,
    sGetPrintDashboardItems,
} from '../../reducers/printDashboard'
import { sGetIsEditing } from '../../reducers/editDashboard'

import {
    GRID_ROW_HEIGHT,
    GRID_COMPACT_TYPE,
    MARGIN,
    getGridColumns,
    hasShape,
} from './gridUtil'
import {
    a4LandscapeWidthPx,
    getDomGridItemsSortedByYPos,
    getTransformY,
} from '../../modules/printUtils'

import { PRINT_LAYOUT } from '../Dashboard/dashboardModes'
import { PAGEBREAK } from '../../modules/itemTypes'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import './ItemGrid.css'

// this is set in the .dashboard-item-content css
export const ITEM_CONTENT_PADDING_BOTTOM = 4

export class PrintLayoutItemGrid extends Component {
    onLayoutChange = newLayout => {
        this.props.updateDashboardLayout(newLayout)
    }

    isFirstPageBreak = item => {
        const pageBreaks = this.props.dashboardItems.filter(
            i => i.type === PAGEBREAK
        )

        const sortedPageBreaks = sortBy(pageBreaks, ['y'])
        return item.y === sortedPageBreaks[0].y
    }

    getItemComponent = item => {
        const itemClassNames = cx('print', 'layout', `${item.type}`, {
            'first-page-break':
                item.type === PAGEBREAK && this.isFirstPageBreak(item),
        })

        return (
            <div key={item.i} className={itemClassNames}>
                <Item item={item} dashboardMode={PRINT_LAYOUT} />
            </div>
        )
    }

    getItemComponents = items => items.map(item => this.getItemComponent(item))

    hideExtraPageBreaks() {
        const sortedElements = getDomGridItemsSortedByYPos(
            Array.from(document.querySelectorAll('.react-grid-item'))
        )

        let pageBreakBottom = 0
        let lastItemBottom = 0
        let foundNonPageBreak = false

        for (let i = sortedElements.length - 1; i >= 0; --i) {
            const item = sortedElements[i]

            if (item.type === PAGEBREAK) {
                if (!foundNonPageBreak) {
                    item.el.classList.add('removed')
                } else {
                    pageBreakBottom = item.bottomY
                    break
                }
            } else {
                foundNonPageBreak = true

                const thisItemBottom = item.bottomY
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
            console.log(
                'jj PROBLEM! items extend beyond page bottom',
                maxHeight,
                '<',
                lastItemBottom
            )
        }
        if (gridElement) {
            gridElement.style.height = `${maxHeight}px`
        }

        if (this.props.isEditing) {
            //scroll to below the title page - which is middle of the first pagebreak
            const firstPageBreak = document.querySelector('.first-page-break')
            if (firstPageBreak && firstPageBreak.style) {
                const yPos = getTransformY(firstPageBreak.style)

                if (yPos) {
                    const scrollArea = document.querySelector('.scroll-area')
                    if (scrollArea) {
                        scrollArea.scroll(0, yPos + 50)
                    }
                }
            }
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
    dashboardItems: PropTypes.array,
    isEditing: PropTypes.bool,
    isLoading: PropTypes.bool,
    updateDashboardLayout: PropTypes.func,
}

PrintLayoutItemGrid.defaultProps = {
    dashboardItems: [],
}

const mapStateToProps = state => {
    const selectedDashboard = sGetPrintDashboardRoot(state)

    return {
        isLoading: sGetSelectedIsLoading(state) || !selectedDashboard,
        dashboardItems: sGetPrintDashboardItems(state).filter(hasShape),
        isEditing: sGetIsEditing(state),
    }
}

export default connect(mapStateToProps, {
    updateDashboardLayout: acUpdatePrintDashboardLayout,
})(PrintLayoutItemGrid)
