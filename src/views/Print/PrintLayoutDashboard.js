import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import cx from 'classnames'

import PrintInfo from './PrintInfo'
import PrintActionsBar from './PrintActionsBar'
import PrintLayoutItemGrid from './PrintLayoutItemGrid'
import {
    acSetPrintDashboard,
    acAddPrintDashboardItem,
    acUpdatePrintDashboardItem,
} from '../../actions/printDashboard'
import { sGetSelectedId } from '../../reducers/selected'
import {
    sGetEditDashboardRoot,
    sGetEditDashboardItems,
} from '../../reducers/editDashboard'
import {
    sGetDashboardById,
    sGetDashboardItems,
} from '../../reducers/dashboards'
import { PAGEBREAK, PRINT_TITLE_PAGE } from '../../modules/itemTypes'
import { MAX_ITEM_GRID_HEIGHT } from '../../modules/gridUtil'
import { getPageBreakPositions } from '../../modules/printUtils'

import classes from './styles/PrintLayoutDashboard.module.css'

import './styles/print.css'
import './styles/print-layout.css'

const addPageBreaks = (items, addDashboardItem) => {
    const yPosList = getPageBreakPositions(items)

    for (let i = 0; i < items.length; ++i) {
        addDashboardItem({ type: PAGEBREAK, yPos: yPosList[i] })
    }
}

const PrintLayoutDashboard = ({
    dashboard,
    items,
    setPrintDashboard,
    addDashboardItem,
    updateDashboardItem,
    fromEdit,
}) => {
    useEffect(() => {
        if (dashboard) {
            setPrintDashboard(dashboard, items)

            // If any items are taller than one page, reduce it to one
            // page (react-grid-layout units)
            items.forEach(item => {
                if (item.h > MAX_ITEM_GRID_HEIGHT) {
                    item.shortened = true
                    updateDashboardItem(
                        Object.assign({}, item, { h: MAX_ITEM_GRID_HEIGHT })
                    )
                }
            })

            addPageBreaks(items, addDashboardItem)

            addDashboardItem({
                type: PRINT_TITLE_PAGE,
                isOneItemPerPage: false,
            })
        }
    }, [dashboard, items])

    return (
        <div className={classes.container}>
            {!fromEdit && <PrintActionsBar id={dashboard.id} />}
            <div
                className={cx(
                    classes.wrapper,
                    'scroll-area',
                    fromEdit && classes.editView
                )}
            >
                {!fromEdit && <PrintInfo isLayout={true} />}
                <div
                    className={classes.pageOuter}
                    data-test="print-layout-page"
                >
                    <PrintLayoutItemGrid />
                </div>
            </div>
        </div>
    )
}

PrintLayoutDashboard.propTypes = {
    addDashboardItem: PropTypes.func,
    dashboard: PropTypes.object,
    fromEdit: PropTypes.bool,
    items: PropTypes.array,
    setPrintDashboard: PropTypes.func,
    updateDashboardItem: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => {
    const id = sGetSelectedId(state)

    if (ownProps.fromEdit) {
        const dashboard = sGetEditDashboardRoot(state)

        return {
            dashboard,
            id,
            items: sGetEditDashboardItems(state),
        }
    }

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
    updateDashboardItem: acUpdatePrintDashboardItem,
})(PrintLayoutDashboard)
