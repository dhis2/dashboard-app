import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { ComponentCover } from '@dhis2/ui'
import cx from 'classnames'
import ViewTitleBar from '../TitleBar/ViewTitleBar'
import ViewItemGrid from '../ItemGrid/ViewItemGrid'
import FilterBar from '../FilterBar/FilterBar'
import DashboardsBar from '../ControlBar/ViewControlBar/DashboardsBar'
import { sGetIsEditing } from '../../reducers/editDashboard'
import { sGetIsPrinting } from '../../reducers/printDashboard'
import { sGetSelectedId } from '../../reducers/selected'
import { acClearEditDashboard } from '../../actions/editDashboard'
import { acClearPrintDashboard } from '../../actions/printDashboard'

import classes from './styles/ViewDashboard.module.css'

export const ViewDashboard = props => {
    const [controlbarExpanded, setControlbarExpanded] = useState(false)

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

    const onExpandedChanged = expanded => setControlbarExpanded(expanded)

    return (
        <div className={classes.container}>
            <DashboardsBar
                expanded={controlbarExpanded}
                onExpandedChanged={onExpandedChanged}
            />
            <div
                className={cx(
                    classes.dashboardContainer,
                    'dashboard-wrapper',
                    controlbarExpanded && classes.covered
                )}
            >
                {controlbarExpanded && (
                    <ComponentCover
                        className={classes.cover}
                        translucent
                        onClick={() => setControlbarExpanded(false)}
                    />
                )}
                <ViewTitleBar />
                <FilterBar />
                <ViewItemGrid />
            </div>
        </div>
    )
}

ViewDashboard.propTypes = {
    clearEditDashboard: PropTypes.func,
    clearPrintDashboard: PropTypes.func,
    dashboardIsEditing: PropTypes.bool,
    dashboardIsPrinting: PropTypes.bool,
    selectedId: PropTypes.string,
}

const mapStateToProps = state => {
    return {
        dashboardIsEditing: sGetIsEditing(state),
        dashboardIsPrinting: sGetIsPrinting(state),
        selectedId: sGetSelectedId(state),
    }
}

export default connect(mapStateToProps, {
    clearEditDashboard: acClearEditDashboard,
    clearPrintDashboard: acClearPrintDashboard,
})(ViewDashboard)
