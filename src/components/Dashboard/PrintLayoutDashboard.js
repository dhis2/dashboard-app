import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { spacers } from '@dhis2/ui'
import cx from 'classnames'

import PrintInfo from './PrintInfo'
import PrintActionsBar, {
    PRINT_ACTIONS_BAR_HEIGHT,
    PRINT_ACTIONS_BAR_HEIGHT_SM,
} from './PrintActionsBar'
import PrintLayoutItemGrid from '../ItemGrid/PrintLayoutItemGrid'
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
import { MAX_ITEM_GRID_HEIGHT } from '../ItemGrid/gridUtil'
import {
    getControlBarHeight,
    HEADERBAR_HEIGHT,
} from '../ControlBar/controlBarDimensions'
import { DRAG_HANDLE_HEIGHT } from '../ControlBar/ControlBar'
import { useWindowDimensions } from '../WindowDimensionsProvider'
import isSmallScreen from '../../modules/isSmallScreen'
import { getPageBreakPositions } from '../../modules/printUtils'

import classes from './styles/PrintLayoutDashboard.module.css'

import './styles/print.css'
import './styles/print-layout.css'

const EDIT_BAR_HEIGHT = getControlBarHeight(1) + DRAG_HANDLE_HEIGHT

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
    const { width, height } = useWindowDimensions()

    const actionBarHeight = isSmallScreen(width)
        ? PRINT_ACTIONS_BAR_HEIGHT_SM
        : PRINT_ACTIONS_BAR_HEIGHT

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

    const getWrapperStyle = () => {
        return fromEdit
            ? {
                  paddingTop: spacers.dp24,
                  height: height - EDIT_BAR_HEIGHT - HEADERBAR_HEIGHT,
              }
            : {
                  height: height - actionBarHeight,
              }
    }

    return (
        <>
            {!fromEdit && <PrintActionsBar id={dashboard.id} />}
            <div
                className={cx(classes.wrapper, 'scroll-area')}
                style={getWrapperStyle()}
            >
                {!fromEdit && <PrintInfo isLayout={true} />}
                <div
                    className={classes.pageOuter}
                    data-test="print-layout-page"
                >
                    <PrintLayoutItemGrid />
                </div>
            </div>
        </>
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
