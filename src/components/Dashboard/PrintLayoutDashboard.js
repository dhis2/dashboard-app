import React, { Component } from 'react'
import { connect } from 'react-redux'
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
} from '../../reducers/dashboards'
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

export class PrintLayoutDashboard extends Component {
    state = {
        initialized: false,
    }

    initPrintLayoutDashboard = () => {
        if (this.props.dashboard) {
            this.setState({ initialized: true })

            const items = this.props.items.map(item => {
                if (item.h > 30) {
                    item.h = 30
                }
                return item
            })
            this.props.setEditDashboard(this.props.dashboard, items)

            if (items.length > 1) {
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
        return (
            <div className="dashboard-wrapper">
                <PrintTitleBar />
                <PrintLayoutItemGrid />
            </div>
        )
    }
}

PrintLayoutDashboard.propTypes = {
    dashboard: PropTypes.object,
    items: PropTypes.array,
    setEditDashboard: PropTypes.func,
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
    setEditDashboard: acSetEditDashboard,
    addDashboardItem: acAddDashboardItem,
})(PrintLayoutDashboard)
