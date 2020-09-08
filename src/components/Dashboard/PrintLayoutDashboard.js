import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { spacers } from '@dhis2/ui'
import cx from 'classnames'

import PrintInfo from './PrintInfo'
import PrintActionsBar from './PrintActionsBar'
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
import {
    a4LandscapeWidthPx,
    MAX_ITEM_GRID_HEIGHT,
} from '../../modules/printUtils'
import {
    getControlBarHeight,
    HEADERBAR_HEIGHT,
} from '../ControlBar/controlBarDimensions'
import { PRINT_ACTIONS_BAR_HEIGHT } from './PrintActionsBar'
import { DRAG_HANDLE_HEIGHT } from '../ControlBar/ControlBar'

import classes from './styles/PrintLayoutDashboard.module.css'

import './styles/print.css'
import './styles/print-layout.css'

const EDIT_BAR_HEIGHT = getControlBarHeight(1) + DRAG_HANDLE_HEIGHT

const isLeapPage = n => {
    // pages 5,9,13,17,21,25,29... are leap pages
    let x = 0
    const startPage = 1
    const getMultiple = factor => startPage + 4 * factor
    let multiple = getMultiple(0)
    let isLeapPage = false
    while (multiple < n) {
        multiple = getMultiple(x)
        ++x
        if (multiple === n) {
            isLeapPage = true
            break
        }
    }
    return isLeapPage
}

const addPageBreaks = ({ items, addDashboardItem }) => {
    // add enough page breaks so that each item could
    // be put on its own page. Due to the react-grid-layout
    // unit system, we have to estimate roughly the size of each
    // page. At regular intervals add a unit, like a leap year
    let yPos = 0
    const yPosList = []
    for (let pageNum = 1; pageNum <= items.length; ++pageNum) {
        if (pageNum === 1) {
            yPos += 35
        } else if (isLeapPage(pageNum)) {
            yPos += 40
        } else {
            yPos += 39
        }
        yPosList.push(yPos)
    }

    for (let i = 0; i < items.length; ++i) {
        addDashboardItem({ type: PAGEBREAK, yPos: yPosList[i] })
    }
}

export class PrintLayoutDashboard extends Component {
    state = {
        initialized: false,
    }

    initPrintLayoutDashboard = () => {
        if (this.props.dashboard) {
            this.setState({ initialized: true })

            this.props.setPrintDashboard(this.props.dashboard, this.props.items)

            // If any items are taller than one page, reduce it to one
            // page (react-grid-layout units)
            this.props.items.forEach(item => {
                if (item.h > MAX_ITEM_GRID_HEIGHT) {
                    item.shortened = true
                    this.props.updateDashboardItem(
                        Object.assign({}, item, { h: MAX_ITEM_GRID_HEIGHT })
                    )
                }
            })

            addPageBreaks(this.props)

            this.props.addDashboardItem({ type: PRINT_TITLE_PAGE })
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

    getWrapperStyle = () => {
        return this.props.fromEdit
            ? {
                  paddingTop: spacers.dp24,
                  height:
                      window.innerHeight - EDIT_BAR_HEIGHT - HEADERBAR_HEIGHT,
              }
            : {
                  height: window.innerHeight - PRINT_ACTIONS_BAR_HEIGHT,
              }
    }

    render() {
        return (
            <>
                {!this.props.fromEdit && (
                    <PrintActionsBar id={this.props.dashboard.id} />
                )}
                <div
                    className={cx(classes.wrapper, 'scroll-area')}
                    style={this.getWrapperStyle()}
                >
                    {!this.props.fromEdit && <PrintInfo isLayout={true} />}
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
