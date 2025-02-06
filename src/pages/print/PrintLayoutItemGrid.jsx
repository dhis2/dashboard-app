import cx from 'classnames'
import sortBy from 'lodash/sortBy.js'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { acUpdatePrintDashboardLayout } from '../../actions/printDashboard.js'
import { Item } from '../../components/Item/Item.jsx'
import { PRINT_LAYOUT } from '../../modules/dashboardModes.js'
import { getFirstOfTypes } from '../../modules/getFirstOfType.js'
import { getGridItemDomElementClassName } from '../../modules/getGridItemDomElementClassName.js'
import { hasShape } from '../../modules/gridUtil.js'
import { PAGEBREAK } from '../../modules/itemTypes.js'
import { sGetIsEditing } from '../../reducers/editDashboard.js'
import { sGetPrintDashboardItems } from '../../reducers/printDashboard.js'
import { getDomGridItemsSortedByYPos, getTransformYPx } from './printUtils.js'
import StaticGrid from './StaticGrid.jsx'

class PrintLayoutItemGrid extends Component {
    onLayoutChange = (newLayout) => {
        this.props.updateDashboardLayout(newLayout)
    }

    isFirstPageBreak = (item) => {
        if (item.type !== PAGEBREAK) {
            return false
        }

        const pageBreaks = this.props.dashboardItems.filter(
            (i) => i.type === PAGEBREAK
        )

        const sortedPageBreaks = sortBy(pageBreaks, ['y'])
        return item.y === sortedPageBreaks[0].y
    }

    getItemComponent = (item) => {
        // the first-page-break class is used in Edit print preview
        const itemClassNames = cx(
            'print',
            'layout',
            getGridItemDomElementClassName(item.id),
            `${item.type}`,
            {
                'first-page-break':
                    this.props.isEditing && this.isFirstPageBreak(item),
                shortened: !!item.shortened,
            }
        )

        return (
            <div
                key={item.i}
                className={itemClassNames}
                data-test={`dashboarditem-${item.id}`}
            >
                <Item item={item} dashboardMode={PRINT_LAYOUT} />
            </div>
        )
    }

    getItemComponents = (items) => {
        const firstOfTypes = getFirstOfTypes(items)

        return items.map((item) => {
            if (firstOfTypes.includes(item.id)) {
                item.firstOfType = true
            }
            return this.getItemComponent(item)
        })
    }

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
        const { dashboardItems } = this.props

        return (
            <StaticGrid
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
    updateDashboardLayout: PropTypes.func,
}

const mapStateToProps = (state) => {
    return {
        dashboardItems: sGetPrintDashboardItems(state).filter(hasShape),
        isEditing: sGetIsEditing(state),
    }
}

export default connect(mapStateToProps, {
    updateDashboardLayout: acUpdatePrintDashboardLayout,
})(PrintLayoutItemGrid)
