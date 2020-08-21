import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'

import PrintInfo from './PrintInfo'
import PrintActionsBar from './PrintActionsBar'
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
import { PAGEBREAK, PRINT_TITLE_PAGE } from '../../modules/itemTypes'
import { a4LandscapeWidthPx } from '../../modules/printUtils'

import classes from './PrintLayoutDashboard.module.css'

import './styles/print.css'
import './styles/print-layout.css'

const isEven = n => n % 2 == 0

const addPageBreaks = ({ items, addDashboardItem }) => {
    // add enough page breaks so that each item could
    // be put on its own page
    let yPos = 0
    const yPosList = []
    for (let i = 0; i < items.length; ++i) {
        if (i === 0) {
            yPos += 34
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

            const items = this.props.items.map(item => {
                if (item.h > 34) {
                    item.h = 34
                }
                return item
            })

            this.props.setEditDashboard(this.props.dashboard, items)

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
