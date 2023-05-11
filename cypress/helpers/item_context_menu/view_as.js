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

// Then('the chart dashboard item displays as a chart', () => {
export const chartItemDisplaysAsChart = () => {
    getDashboardItem(chartItemUid)
        .getIframeBody()
        .find(chartClass, EXTENDED_TIMEOUT)
        .should('exist')
        .and('be.visible')
}

// Then('the table dashboard item displays as a table', () => {
export const tableItemDisplaysAsTable = () => {
    getDashboardItem(tableItemUid)
        .getIframeBody()
        .find(tableClass, EXTENDED_TIMEOUT)
        .should('exist')
        .and('be.visible')
}

// When('I click View As Table on a chart dashboard item', () => {
export const clickViewAsTableOnChartItem = () => {
    clickItemMenuButton(chartItemUid)
    cy.contains('View as Table').click()
}

// Then('the chart dashboard item displays as a table', () => {
export const chartItemDisplaysAsTable = () => {
    getDashboardItem(chartItemUid)
        .getIframeBody()
        .find(tableClass, EXTENDED_TIMEOUT)
        .should('exist')
        .and('be.visible')
}

// When('I click View As Map on a chart dashboard item', () => {
export const clickViewAsMapOnChartItem = () => {
    clickItemMenuButton(chartItemUid)
    cy.contains('View as Map').click()
}

// Then('the chart dashboard item displays as a map', () => {
export const chartItemDisplaysAsMap = () => {
    getDashboardItem(chartItemUid)
        .getIframeBody()
        .find(mapClass, EXTENDED_TIMEOUT)
        .should('exist')
        .and('be.visible')
}

// When('I click View As Chart on a table dashboard item', () => {
export const clickViewAsChartOnTableItem = () => {
    clickItemMenuButton(tableItemUid)
    cy.contains('View as Chart').click()
}

// Then('the table dashboard item displays as a chart', () => {
export const tableItemDisplaysAsChart = () => {
    getDashboardItem(tableItemUid)
        .getIframeBody()
        .find(chartClass, EXTENDED_TIMEOUT)
        .should('exist')
        .and('be.visible')
}
