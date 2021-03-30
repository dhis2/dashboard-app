import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import sortBy from 'lodash/sortBy'

import PrintInfo from './PrintInfo'
import PrintActionsBar from './ActionsBar'
import PrintItemGrid from './PrintItemGrid'
import {
    acSetPrintDashboard,
    acAddPrintDashboardItem,
    acRemovePrintDashboardItem,
    acUpdatePrintDashboardItem,
} from '../../actions/printDashboard'
import { sGetSelectedId } from '../../reducers/selected'
import {
    sGetDashboardById,
    sGetDashboardItems,
} from '../../reducers/dashboards'
import { PAGEBREAK, PRINT_TITLE_PAGE, SPACER } from '../../modules/itemTypes'
import {
    MAX_ITEM_GRID_HEIGHT_OIPP,
    MAX_ITEM_GRID_WIDTH_OIPP,
} from '../../modules/gridUtil'

import classes from './styles/PrintDashboard.module.css'

import './styles/print.css'
import './styles/print-oipp.css'

const PrintDashboard = ({
    dashboard,
    items,
    setPrintDashboard,
    addDashboardItem,
    updateDashboardItem,
    removeDashboardItem,
}) => {
    useEffect(() => {
        if (dashboard) {
            //sort the items by Y pos so they print in order of top to bottom
            const sortedItems = sortBy(items, ['y', 'x'])

            setPrintDashboard(dashboard, sortedItems)

            // remove spacers - don't want empty pages
            let spacerCount = 0
            items.forEach(item => {
                if (item.type === SPACER) {
                    spacerCount += 1
                    removeDashboardItem(item.id)
                }
            })

            // Resize the items to the full page size
            items.forEach(item => {
                updateDashboardItem(
                    Object.assign({}, item, {
                        w: MAX_ITEM_GRID_WIDTH_OIPP,
                        h: MAX_ITEM_GRID_HEIGHT_OIPP,
                    })
                )
            })

            // insert page breaks into the document flow to create the "pages"
            // when previewing the print
            for (let i = 0; i < (items.length - spacerCount) * 2; i += 2) {
                addDashboardItem({
                    type: PAGEBREAK,
                    position: i,
                    isStatic: false,
                })
            }

            addDashboardItem({
                type: PRINT_TITLE_PAGE,
                isOneItemPerPage: true,
            })
        }
    }, [dashboard, items])

    return (
        <div className={classes.container}>
            <PrintActionsBar id={dashboard.id} />
            <div className={classes.wrapper}>
                <PrintInfo isLayout={false} />
                <div className={classes.pageOuter} data-test="print-oipp-page">
                    <PrintItemGrid />
                </div>
            </div>
        </div>
    )
}

PrintDashboard.propTypes = {
    addDashboardItem: PropTypes.func,
    dashboard: PropTypes.object,
    items: PropTypes.array,
    removeDashboardItem: PropTypes.func,
    setPrintDashboard: PropTypes.func,
    updateDashboardItem: PropTypes.func,
}

const mapStateToProps = state => {
    const id = sGetSelectedId(state)
    const dashboard = id ? sGetDashboardById(state, id) : null

    return {
        dashboard,
        id,
        items: sGetDashboardItems(state),
    }
}

export default connect(mapStateToProps, {
    setPrintDashboard: acSetPrintDashboard,
    addDashboardItem: acAddPrintDashboardItem,
    removeDashboardItem: acRemovePrintDashboardItem,
    updateDashboardItem: acUpdatePrintDashboardItem,
})(PrintDashboard)
