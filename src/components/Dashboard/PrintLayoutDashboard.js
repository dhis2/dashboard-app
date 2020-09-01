import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

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
import { a4LandscapeWidthPx } from '../../modules/printUtils'

import classes from './styles/PrintLayoutDashboard.module.css'

import './styles/print.css'
import './styles/print-layout.css'

const isEven = n => n % 2 == 0

const addPageBreaks = ({ items, addDashboardItem }) => {
    // add enough page breaks so that each item could
    // be put on its own page. Due to the react-grid-layout
    // unit system, we have to estimate roughly the size of each
    // page. At regular intervals adding an extra unit, like a leap year :P
    let yPos = 0
    const yPosList = []
    for (let i = 0; i < items.length; ++i) {
        if (i === 0) {
            yPos += 35
        } else if (i === 4 || i === 10) {
            yPos += 40
        } else if (isEven(i)) {
            yPos += 39
        } else {
            yPos += 40
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
                if (item.h > 34) {
                    this.props.updateDashboardItem(
                        Object.assign({}, item, { h: 34 })
                    )
                }
            })

            addPageBreaks(this.props)

            if (!this.props.fromEdit) {
                this.props.addDashboardItem({ type: PRINT_TITLE_PAGE })
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

    getHeight = () => {
        return this.props.fromEdit
            ? window.innerHeight
            : window.innerHeight - 42
    }

    render() {
        const style = this.props.fromEdit ? { marginTop: '100px' } : {}
        style.height = this.getHeight()

        return (
            <>
                {!this.props.fromEdit && (
                    <>
                        <PrintActionsBar id={this.props.dashboard.id} />
                    </>
                )}
                <div className={classes.wrapper} style={style}>
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
