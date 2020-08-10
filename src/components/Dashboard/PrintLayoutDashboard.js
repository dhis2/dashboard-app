import React, { Component } from 'react'
import { connect } from 'react-redux'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'

import PrintTitleBar from '../TitleBar/PrintTitleBar'
import PrintLayoutItemGrid from '../ItemGrid/PrintLayoutItemGrid'
import {
    acSetEditDashboard,
    acAddDashboardItem,
} from '../../actions/editDashboard'
import { sGetSelectedId } from '../../reducers/selected'
import {
    sGetDashboardById,
    sGetDashboardItems,
    sDashboardsIsFetching,
} from '../../reducers/dashboards'
import NoContentMessage from '../../widgets/NoContentMessage'
import { getNumPrintPages } from '../../modules/printUtils'
import { PAGEBREAK } from '../../modules/itemTypes'

const addPageBreaks = ({ items, addDashboardItem }) => {
    // TODO: this is not accurate bc adding the static page
    // breaks can increase the number of actual pages
    const pageCount = getNumPrintPages(items) + 1
    const yList = [33, 72, 110, 149, 187, 226, 264]
    for (let i = 0; i < pageCount; ++i) {
        addDashboardItem({ type: PAGEBREAK, yPos: yList[i] })
    }

    return items
}

export const Content = ({ updateAccess }) => {
    return updateAccess ? (
        <>
            <PrintTitleBar />
            <PrintLayoutItemGrid />
        </>
    ) : (
        <NoContentMessage text={i18n.t('No access')} />
    )
}

Content.propTypes = {
    updateAccess: PropTypes.bool,
}
export class PrintLayoutDashboard extends Component {
    state = {
        initialized: false,
    }

    initPrintLayoutDashboard = () => {
        if (this.props.dashboard) {
            this.setState({ initialized: true })
            this.props.setEditDashboard(this.props.dashboard, this.props.items)

            if (this.props.items.length > 0) {
                addPageBreaks(this.props)
            }
        }
    }

    componentDidMount() {
        this.initPrintLayoutDashboard()
    }

    componentDidUpdate() {
        if (!this.state.initialized) {
            this.initPrintLayoutDashboard()
        }
    }

    render() {
        const contentNotReady =
            !this.props.dashboardsLoaded || this.props.id === null

        return (
            <div className="dashboard-wrapper">
                {contentNotReady ? null : (
                    <Content updateAccess={this.props.updateAccess} />
                )}
            </div>
        )
    }
}

PrintLayoutDashboard.propTypes = {
    dashboard: PropTypes.object,
    dashboardsLoaded: PropTypes.bool,
    id: PropTypes.string,
    items: PropTypes.array,
    setEditDashboard: PropTypes.func,
    updateAccess: PropTypes.bool,
}

const mapStateToProps = state => {
    const id = sGetSelectedId(state)
    const dashboard = id ? sGetDashboardById(state, id) : null

    const updateAccess =
        dashboard && dashboard.access ? dashboard.access.update : false

    return {
        dashboard,
        id,
        updateAccess,
        items: sGetDashboardItems(state),
        dashboardsLoaded: !sDashboardsIsFetching(state),
    }
}

export default connect(mapStateToProps, {
    setEditDashboard: acSetEditDashboard,
    addDashboardItem: acAddDashboardItem,
})(PrintLayoutDashboard)
