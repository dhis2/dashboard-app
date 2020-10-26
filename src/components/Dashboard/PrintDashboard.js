import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import sortBy from 'lodash/sortBy'

import PrintInfo from './PrintInfo'
import PrintActionsBar from './PrintActionsBar'
import PrintItemGrid from '../ItemGrid/PrintItemGrid'
import {
    acSetPrintDashboard,
    acAddPrintDashboardItem,
    acRemovePrintDashboardItem,
    acUpdatePrintDashboardItem,
} from '../../actions/printDashboard'
import { sGetSelectedId } from '../../reducers/selected'
import { sGetWindowHeight } from '../../reducers/windowHeight'
import {
    sGetDashboardById,
    sGetDashboardItems,
} from '../../reducers/dashboards'
import { PAGEBREAK, PRINT_TITLE_PAGE, SPACER } from '../../modules/itemTypes'
import {
    a4LandscapeWidthPx,
    MAX_ITEM_GRID_HEIGHT_OIPP,
    MAX_ITEM_GRID_WIDTH_OIPP,
} from '../ItemGrid/gridUtil'
import { PRINT_ACTIONS_BAR_HEIGHT } from './PrintActionsBar'

import classes from './styles/PrintDashboard.module.css'

import './styles/print.css'
import './styles/print-oipp.css'

export class PrintDashboard extends Component {
    state = {
        initialized: false,
    }

    initPrintDashboard = () => {
        if (this.props.dashboard) {
            this.setState({ initialized: true })

            //sort the items by Y pos so they print in order of top to bottom
            const sortedItems = sortBy(this.props.items, ['y', 'x'])

            this.props.setPrintDashboard(this.props.dashboard, sortedItems)

            // remove spacers - don't want empty pages
            let spacerCount = 0
            this.props.items.forEach(item => {
                if (item.type === SPACER) {
                    spacerCount += 1
                    this.props.removeDashboardItem(item.id)
                }
            })

            // Resize the items to the full page size
            this.props.items.forEach(item => {
                this.props.updateDashboardItem(
                    Object.assign({}, item, {
                        w: MAX_ITEM_GRID_WIDTH_OIPP,
                        h: MAX_ITEM_GRID_HEIGHT_OIPP,
                    })
                )
            })

            // insert page breaks into the document flow to create the "pages"
            // when previewing the print
            for (
                let i = 0;
                i < (this.props.items.length - spacerCount) * 2;
                i += 2
            ) {
                this.props.addDashboardItem({
                    type: PAGEBREAK,
                    position: i,
                    isStatic: false,
                })
            }

            this.props.addDashboardItem({
                type: PRINT_TITLE_PAGE,
                isOneItemPerPage: true,
            })
        }
    }

    componentDidMount() {
        this.initPrintDashboard()
    }

    componentDidUpdate() {
        if (!this.state.initialized) {
            this.initPrintDashboard()
        }
    }

    render() {
        const height = this.props.windowHeight - PRINT_ACTIONS_BAR_HEIGHT

        return (
            <>
                <PrintActionsBar id={this.props.dashboard.id} />
                <div className={classes.wrapper} style={{ height }}>
                    <PrintInfo isLayout={false} />
                    <div
                        className={classes.pageOuter}
                        style={{ width: a4LandscapeWidthPx }}
                        data-test="dhis2-dashboard-print-oipp-page"
                    >
                        <PrintItemGrid />
                    </div>
                </div>
            </>
        )
    }
}

PrintDashboard.propTypes = {
    addDashboardItem: PropTypes.func,
    dashboard: PropTypes.object,
    items: PropTypes.array,
    removeDashboardItem: PropTypes.func,
    setPrintDashboard: PropTypes.func,
    updateDashboardItem: PropTypes.func,
    windowHeight: PropTypes.number,
}

const mapStateToProps = state => {
    const id = sGetSelectedId(state)
    const dashboard = id ? sGetDashboardById(state, id) : null

    return {
        dashboard,
        id,
        items: sGetDashboardItems(state),
        windowHeight: sGetWindowHeight(state),
    }
}

export default connect(mapStateToProps, {
    setPrintDashboard: acSetPrintDashboard,
    addDashboardItem: acAddPrintDashboardItem,
    removeDashboardItem: acRemovePrintDashboardItem,
    updateDashboardItem: acUpdatePrintDashboardItem,
})(PrintDashboard)
