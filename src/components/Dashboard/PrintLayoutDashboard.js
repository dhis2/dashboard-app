import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'

import PrintInfo from './PrintInfo'
import PrintActionsBar from './PrintActionsBar'
import PrintLayoutItemGrid from '../ItemGrid/PrintLayoutItemGrid'
import { a4LandscapeWidthPx } from '../../modules/printUtils'
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
import { PAGEBREAK, PRINT_TITLE_PAGE } from '../../modules/itemTypes'

import classes from './PrintLayoutDashboard.module.css'

const addPageBreaks = ({ items, addDashboardItem }) => {
    // TODO: this is not accurate bc adding the static page
    // breaks can increase the number of actual pages
    const pageCount = getNumPrintPages(items) + 1
    const yList = [34, 74, 113, 153, 192, 232, 271]
    //
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
                if (item.h > 34) {
                    item.h = 34
                }
                return item
            })
            this.props.setEditDashboard(this.props.dashboard, items)

            this.props.addDashboardItem({ type: PRINT_TITLE_PAGE })

            addPageBreaks(this.props)
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
            <>
                <PrintActionsBar id={this.props.dashboard.id} />
                <div className={classes.wrapper}>
                    <PrintInfo type={i18n.t('dashboard layout')} />
                    <div
                        className={classes.pageOuter}
                        style={{ width: a4LandscapeWidthPx }}
                    >
                        <PrintLayoutItemGrid />
                    </div>
                </div>
            </>
        )
    }
}

PrintLayoutDashboard.propTypes = {
    addDashboardItem: PropTypes.func,
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
