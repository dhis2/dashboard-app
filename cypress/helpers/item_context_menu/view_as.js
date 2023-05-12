import { dashboards } from '../../assets/backends/index.js'
import {
    chartClass,
    mapClass,
    tableClass,
    clickItemMenuButton,
    getDashboardItem,
} from '../../elements/dashboardItem.js'
import { EXTENDED_TIMEOUT } from '../../support/utils.js'

// these tests being run on the "Delivery" dashboard
const chartItemUid = dashboards.Delivery.items.chart.itemUid
const tableItemUid = dashboards.Delivery.items.table.itemUid

export const chartItemDisplaysAsChart = () => {
    getDashboardItem(chartItemUid)
        .getIframeBody()
        .find(chartClass, EXTENDED_TIMEOUT)
        .should('exist')
        .and('be.visible')
}

export const tableItemDisplaysAsTable = () => {
    getDashboardItem(tableItemUid)
        .getIframeBody()
        .find(tableClass, EXTENDED_TIMEOUT)
        .should('exist')
        .and('be.visible')
}

export const clickViewAsTableOnChartItem = () => {
    clickItemMenuButton(chartItemUid)
    cy.contains('View as Table').click()
}

export const chartItemDisplaysAsTable = () => {
    getDashboardItem(chartItemUid)
        .getIframeBody()
        .find(tableClass, EXTENDED_TIMEOUT)
        .should('exist')
        .and('be.visible')
}

export const clickViewAsMapOnChartItem = () => {
    clickItemMenuButton(chartItemUid)
    cy.contains('View as Map').click()
}

export const chartItemDisplaysAsMap = () => {
    getDashboardItem(chartItemUid)
        .getIframeBody()
        .find(mapClass, EXTENDED_TIMEOUT)
        .should('exist')
        .and('be.visible')
}

export const clickViewAsChartOnTableItem = () => {
    clickItemMenuButton(tableItemUid)
    cy.contains('View as Chart').click()
}

export const tableItemDisplaysAsChart = () => {
    getDashboardItem(tableItemUid)
        .getIframeBody()
        .find(chartClass, EXTENDED_TIMEOUT)
        .should('exist')
        .and('be.visible')
}
