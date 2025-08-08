import { dashboards } from '../assets/backends/index.js'
import {
    chartSel,
    mapSel,
    tableSel,
    clickMenuButton,
    getDashboardItem,
    confirmViewMode,
} from '../elements/index.js'
import { EXTENDED_TIMEOUT } from '../support/utils.js'

const chartItemUid = dashboards.Delivery.items.chart.itemUid
const tableItemUid = dashboards.Delivery.items.table.itemUid

const assertChartItemDisplayedAsChart = () => {
    getDashboardItem(chartItemUid)
        .getIframeBody()
        .find(chartSel, EXTENDED_TIMEOUT)
        .as('chart')
    cy.get('@chart').should('exist').and('be.visible')
}
const assertTableItemDisplayedAsTable = () => {
    getDashboardItem(tableItemUid)
        .getIframeBody()
        .find(tableSel, EXTENDED_TIMEOUT)
        .as('table')
    cy.get('@table').should('exist').should('exist').and('be.visible')
}

it.skip('displays chart as table', () => {
    cy.visit(`/${dashboards.Delivery.route}`)
    confirmViewMode('Delivery')

    assertChartItemDisplayedAsChart()
    assertTableItemDisplayedAsTable()

    // Click view as table
    clickMenuButton(chartItemUid)
    cy.contains('View as Pivot table').click()

    // Chart item displays as a table
    getDashboardItem(chartItemUid)
        .getIframeBody()
        .find(tableSel, EXTENDED_TIMEOUT)
        .as('vis')
    cy.get('@vis').should('exist').should('exist').and('be.visible')
})

it.skip('displays chart as map', () => {
    cy.visit(`/${dashboards.Delivery.route}`)
    confirmViewMode('Delivery')

    assertChartItemDisplayedAsChart()
    assertTableItemDisplayedAsTable()

    // Click view as map
    clickMenuButton(chartItemUid)
    cy.contains('View as Map').click()

    // Chart item displays as a map
    getDashboardItem(chartItemUid)
        .getIframeBody()
        .find(mapSel, EXTENDED_TIMEOUT)
        .as('vis')
    cy.get('@vis').should('exist').should('exist').and('be.visible')
})

it.skip('displays table as chart', () => {
    cy.visit(`/${dashboards.Delivery.route}`)
    confirmViewMode('Delivery')

    assertChartItemDisplayedAsChart()
    assertTableItemDisplayedAsTable()

    // Click view as chart
    clickMenuButton(tableItemUid)
    cy.contains('View as Chart').click()

    // Table item displays as a chart
    getDashboardItem(tableItemUid)
        .getIframeBody()
        .find(chartSel, EXTENDED_TIMEOUT)
        .as('vis')
    cy.get('@vis').should('exist').and('be.visible')
})
