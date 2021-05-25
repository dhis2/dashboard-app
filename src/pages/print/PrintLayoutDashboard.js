import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { Redirect } from 'react-router-dom'
import { Layer, CenteredContent, CircularLoader } from '@dhis2/ui'
import { useDataEngine } from '@dhis2/app-runtime'

import PrintInfo from './PrintInfo'
import { apiFetchDashboard } from '../../api/fetchDashboard'

import { MAX_ITEM_GRID_HEIGHT } from '../../modules/gridUtil'
import PrintActionsBar from './ActionsBar'
import PrintLayoutItemGrid from './PrintLayoutItemGrid'
import {
    acSetPrintDashboard,
    acAddPrintDashboardItem,
    acUpdatePrintDashboardItem,
} from '../../actions/printDashboard'
import { setHeaderbarVisible } from '../../modules/setHeaderbarVisible'
import { sGetEditDashboardRoot } from '../../reducers/editDashboard'

import { PAGEBREAK, PRINT_TITLE_PAGE } from '../../modules/itemTypes'
import { getPageBreakPositions } from './printUtils'

import classes from './styles/PrintLayoutDashboard.module.css'

import './styles/print.css'
import './styles/print-layout.css'

const addPageBreaks = (items, addDashboardItem) => {
    const yPosList = getPageBreakPositions(items)

    for (let i = 0; i < items.length; ++i) {
        addDashboardItem({ type: PAGEBREAK, yPos: yPosList[i] })
    }
}

const PrintLayoutDashboard = ({
    dashboard,
    id,
    setPrintDashboard,
    addDashboardItem,
    updateDashboardItem,
    fromEdit,
}) => {
    const dataEngine = useDataEngine()
    const [redirectUrl, setRedirectUrl] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const customizePrintLayoutDashboard = dboard => {
        // If any items are taller than one page, reduce it to one
        // page (react-grid-layout units)
        dboard.dashboardItems.forEach(item => {
            if (item.h > MAX_ITEM_GRID_HEIGHT) {
                item.shortened = true
                updateDashboardItem(
                    Object.assign({}, item, { h: MAX_ITEM_GRID_HEIGHT })
                )
            }
        })

        addPageBreaks(dboard.dashboardItems, addDashboardItem)

        addDashboardItem({
            type: PRINT_TITLE_PAGE,
            isOneItemPerPage: false,
        })

        setIsLoading(false)
    }

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const dashboard = await apiFetchDashboard(dataEngine, id)
                setPrintDashboard(dashboard)
                customizePrintLayoutDashboard(dashboard)
            } catch (error) {
                setRedirectUrl(id)
                setIsLoading(false)
            }
        }

        setHeaderbarVisible(false)

        if (!dashboard) {
            loadDashboard()
        } else {
            setPrintDashboard(dashboard)
            customizePrintLayoutDashboard(dashboard)
        }
    }, [dashboard])

    if (redirectUrl) {
        return <Redirect to={redirectUrl} />
    }

    if (isLoading) {
        return (
            <Layer translucent>
                <CenteredContent>
                    <CircularLoader />
                </CenteredContent>
            </Layer>
        )
    }

    return (
        <div className={classes.container}>
            {!fromEdit && <PrintActionsBar id={id} />}
            <div
                className={cx(
                    classes.wrapper,
                    'scroll-area',
                    fromEdit && classes.editView
                )}
            >
                {!fromEdit && <PrintInfo isLayout={true} />}
                <div
                    className={classes.pageOuter}
                    data-test="print-layout-page"
                >
                    <PrintLayoutItemGrid />
                </div>
            </div>
        </div>
    )
}

PrintLayoutDashboard.propTypes = {
    addDashboardItem: PropTypes.func,
    dashboard: PropTypes.object,
    fromEdit: PropTypes.bool,
    id: PropTypes.string,
    setPrintDashboard: PropTypes.func,
    updateDashboardItem: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => {
    return {
        dashboard: ownProps.fromEdit ? sGetEditDashboardRoot(state) : null,
        id: ownProps.match?.params?.dashboardId || null,
    }
}

export default connect(mapStateToProps, {
    setPrintDashboard: acSetPrintDashboard,
    addDashboardItem: acAddPrintDashboardItem,
    updateDashboardItem: acUpdatePrintDashboardItem,
})(PrintLayoutDashboard)
