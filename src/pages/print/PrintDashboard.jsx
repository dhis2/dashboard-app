import { useDataEngine } from '@dhis2/app-runtime'
import { Layer, CenteredContent, CircularLoader } from '@dhis2/ui'
import sortBy from 'lodash/sortBy.js'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import {
    acSetPrintDashboard,
    acAddPrintDashboardItem,
    acRemovePrintDashboardItem,
    acUpdatePrintDashboardItem,
} from '../../actions/printDashboard.js'
import { apiFetchDashboard } from '../../api/fetchDashboard.js'
import { VIEW } from '../../modules/dashboardModes.js'
import {
    MAX_ITEM_GRID_HEIGHT_OIPP,
    MAX_ITEM_GRID_WIDTH_OIPP,
} from '../../modules/gridUtil.js'
import { PAGEBREAK, PRINT_TITLE_PAGE, SPACER } from '../../modules/itemTypes.js'
import { setHeaderbarVisible } from '../../modules/setHeaderbarVisible.js'
import PrintActionsBar from './ActionsBar.jsx'
import PrintInfo from './PrintInfo.jsx'
import PrintItemGrid from './PrintItemGrid.jsx'
import classes from './styles/PrintDashboard.module.css'

import './styles/print.css'
import './styles/print-oipp.css'

const PrintDashboard = ({
    match,
    setPrintDashboard,
    addDashboardItem,
    updateDashboardItem,
    removeDashboardItem,
}) => {
    const dataEngine = useDataEngine()
    const [redirectUrl, setRedirectUrl] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const id = match?.params?.dashboardId || null

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const dashboard = await apiFetchDashboard(dataEngine, id, {
                    mode: VIEW,
                })
                //sort the items by Y pos so they print in order of top to bottom
                const sortedItems = sortBy(dashboard.dashboardItems, ['y', 'x'])

                setPrintDashboard(
                    Object.assign({}, dashboard, {
                        dashboardItems: sortedItems,
                    })
                )

                // remove spacers - don't want empty pages
                let spacerCount = 0
                sortedItems.forEach((item) => {
                    if (item.type === SPACER) {
                        spacerCount += 1
                        removeDashboardItem(item.id)
                    }
                })

                // Resize the items to the full page size
                sortedItems.forEach((item) => {
                    updateDashboardItem(
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
                    i < (sortedItems.length - spacerCount) * 2;
                    i += 2
                ) {
                    addDashboardItem({
                        type: PAGEBREAK,
                        position: i,
                        isStatic: false,
                    })
                }

                addDashboardItem({
                    type: PRINT_TITLE_PAGE,
                    isOneItemPerPage: true,
                })

                setIsLoading(false)
            } catch (error) {
                setRedirectUrl(id ? `/${id}` : '/')
                setIsLoading(false)
            }
        }

        setHeaderbarVisible(false)

        loadDashboard()
    }, [id])

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
            <PrintActionsBar id={id} />
            <div className={classes.wrapper}>
                <PrintInfo isLayout={false} />
                <div className={classes.pageOuter} data-test="print-oipp-page">
                    <PrintItemGrid />
                </div>
            </div>
        </div>
    )
}

PrintDashboard.propTypes = {
    addDashboardItem: PropTypes.func,
    match: PropTypes.object,
    removeDashboardItem: PropTypes.func,
    setPrintDashboard: PropTypes.func,
    updateDashboardItem: PropTypes.func,
}

export default connect(null, {
    setPrintDashboard: acSetPrintDashboard,
    addDashboardItem: acAddPrintDashboardItem,
    removeDashboardItem: acRemovePrintDashboardItem,
    updateDashboardItem: acUpdatePrintDashboardItem,
})(PrintDashboard)
