import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ViewTitleBar from '../TitleBar/ViewTitleBar'
import ViewItemGrid from '../ItemGrid/ViewItemGrid'
import FilterBar from '../FilterBar/FilterBar'
import DashboardsBar from '../ControlBar/DashboardsBar'
import { sGetIsEditing } from '../../reducers/editDashboard'
import { sGetIsPrinting } from '../../reducers/printDashboard'
import { sGetSelectedId } from '../../reducers/selected'
import { sGetControlBarUserRows } from '../../reducers/controlBar'
import { acClearEditDashboard } from '../../actions/editDashboard'
import { acClearPrintDashboard } from '../../actions/printDashboard'
import {
    getControlBarHeight,
    HEADERBAR_HEIGHT,
} from '../ControlBar/controlBarDimensions'
import { useWindowDimensions } from '../WindowDimensionsProvider'

export const ViewDashboard = props => {
    const { height } = useWindowDimensions()

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

    const contentHeight =
        height - HEADERBAR_HEIGHT - getControlBarHeight(props.controlBarRows)

    return (
        <>
            <DashboardsBar />
            <div
                className={'dashboard-wrapper'}
                style={{ height: contentHeight }}
            >
                <ViewTitleBar />
                <FilterBar />
                <ViewItemGrid />
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
