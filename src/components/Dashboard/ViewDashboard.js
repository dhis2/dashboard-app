import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import ViewTitleBar from '../TitleBar/ViewTitleBar'
import ItemGrid from '../ItemGrid/ItemGrid'
import FilterBar from '../FilterBar/FilterBar'
import DashboardsBar, {
    isDashboardBarMaxHeight,
} from '../ControlBar/DashboardsBar'
import { sGetIsEditing } from '../../reducers/editDashboard'
import { sGetIsPrinting } from '../../reducers/printDashboard'
import { sGetSelectedId } from '../../reducers/selected'
import { sGetControlBarUserRows } from '../../reducers/controlBar'
import { acClearEditDashboard } from '../../actions/editDashboard'
import { acClearPrintDashboard } from '../../actions/printDashboard'
import {
    CONTROL_BAR_COLLAPSED,
    getControlBarHeight,
    getControlBarHeightSmallDevice,
    HEADERBAR_HEIGHT,
} from '../ControlBar/controlBarDimensions'
import { useWindowDimensions } from '../WindowDimensionsProvider'
import isSmallScreen from '../../modules/isSmallScreen'

export const ViewDashboard = props => {
    const { width, height } = useWindowDimensions()

    useEffect(() => {
        if (props.dashboardIsEditing) {
            props.clearEditDashboard()
        } else if (props.dashboardIsPrinting) {
            props.clearPrintDashboard()
        }
    }, [props.dashboardIsEditing, props.dashboardIsPrinting])

    useEffect(() => {
        document.querySelector('.dashboard-wrapper')?.scroll(0, 0)
    }, [props.selectedId])

    const dashboardHeight =
        height -
        HEADERBAR_HEIGHT -
        (isSmallScreen(width) && !isDashboardBarMaxHeight(props.controlBarRows)
            ? getControlBarHeightSmallDevice(CONTROL_BAR_COLLAPSED)
            : getControlBarHeight(props.controlBarRows))

    return (
        <>
            <DashboardsBar />
            <div
                className="dashboard-wrapper"
                style={{ height: dashboardHeight }}
            >
                <ViewTitleBar />
                <FilterBar />
                <ItemGrid edit={false} />
            </div>
        </>
    )
}

ViewDashboard.propTypes = {
    clearEditDashboard: PropTypes.func,
    clearPrintDashboard: PropTypes.func,
    controlBarRows: PropTypes.number,
    dashboardIsEditing: PropTypes.bool,
    dashboardIsPrinting: PropTypes.bool,
    selectedId: PropTypes.string,
}

const mapStateToProps = state => {
    return {
        dashboardIsEditing: sGetIsEditing(state),
        dashboardIsPrinting: sGetIsPrinting(state),
        controlBarRows: sGetControlBarUserRows(state),
        selectedId: sGetSelectedId(state),
    }
}

export default connect(mapStateToProps, {
    clearEditDashboard: acClearEditDashboard,
    clearPrintDashboard: acClearPrintDashboard,
})(ViewDashboard)
