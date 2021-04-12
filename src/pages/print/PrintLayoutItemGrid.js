import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import sortBy from 'lodash/sortBy'
import cx from 'classnames'

import StaticGrid from './StaticGrid'
import { Item } from '../../components/Item/Item'

import { acUpdatePrintDashboardLayout } from '../../actions/printDashboard'
import { sGetSelectedIsLoading } from '../../reducers/selected'
import {
    sGetPrintDashboardRoot,
    sGetPrintDashboardItems,
} from '../../reducers/printDashboard'
import { sGetIsEditing } from '../../reducers/editDashboard'

import { hasShape } from '../../modules/gridUtil'
import { getDomGridItemsSortedByYPos, getTransformYPx } from './printUtils'

import { PRINT_LAYOUT } from '../../modules/dashboardModes'
import { PAGEBREAK } from '../../modules/itemTypes'

export class PrintLayoutItemGrid extends Component {
    onLayoutChange = newLayout => {
        this.props.updateDashboardLayout(newLayout)
    }

    isFirstPageBreak = item => {
        if (item.type !== PAGEBREAK) {
            return false
        }

        const pageBreaks = this.props.dashboardItems.filter(
            i => i.type === PAGEBREAK
        )

        const sortedPageBreaks = sortBy(pageBreaks, ['y'])
        return item.y === sortedPageBreaks[0].y
    }

    getItemComponent = item => {
        // the first-page-break class is used in Edit print preview
        const itemClassNames = cx('print', 'layout', `${item.type}`, {
            'first-page-break':
                this.props.isEditing && this.isFirstPageBreak(item),
            shortened: !!item.shortened,
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
        // the last page break is before the last item(s) so
        // maxHeight is one page beyond the last page break
        const maxHeight = pageBreakBottom + pageHeight

        if (gridElement) {
            gridElement.style.height = `${maxHeight}px`
        }

        if (this.props.isEditing) {
            //scroll to below the title page - which is middle of the first pagebreak
            const firstBreak = document.querySelector('.first-page-break')
            if (firstBreak && firstBreak.style && firstBreak.style.transform) {
                const yPos = getTransformYPx(firstBreak.style)
                const scrollArea = document.querySelector('.scroll-area')

                scrollArea && scrollArea.scroll(0, yPos + 50)
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

        return (
            <StaticGrid
                isLoading={isLoading}
                layout={dashboardItems}
                onLayoutChange={this.onLayoutChange}
            >
                {this.getItemComponents(dashboardItems)}
            </StaticGrid>
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
