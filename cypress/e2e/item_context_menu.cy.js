import { dashboards } from '../assets/backends/index.js'
import {
    getDashboardItem,
    itemMenuButtonSel,
    clickMenuButton,
    itemDetailsSel,
} from '../elements/dashboardItem.js'
import {
    openChartInDataVisualizerApp,
    expectChartToBeOpenedInDataVisualizerApp,
} from '../helpers/item_context_menu/open_in_app.js'
import { openSLDashboard } from '../helpers/open_the_SL_dashboard.js'
import { EXTENDED_TIMEOUT } from '../support/utils.js'

describe('Item context menu', () => {
    // FIXME
    it.skip('displays chart as table', () => {
        cy.visit('/', EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))
        openSLDashboard('Delivery')
        // And the chart dashboard item displays as a chart
        // And the table dashboard item displays as a table
        // When I click View As Table on a chart dashboard item
        // Then the chart dashboard item displays as a table
    })

    // FIXME
    it.skip('displays chart as map', () => {
        cy.visit('/', EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))
        openSLDashboard('Delivery')
        // And the chart dashboard item displays as a chart
        // And the table dashboard item displays as a table
        // When I click View As Map on a chart dashboard item
        // Then the chart dashboard item displays as a map
    })

    // FIXME
    it.skip('displays table as chart', () => {
        cy.visit('/', EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))
        openSLDashboard('Delivery')
        // And the chart dashboard item displays as a chart
        // And the table dashboard item displays as a table
        // When I click View As Chart on a table dashboard item
        // Then the table dashboard item displays as a chart
    })

    it('opens chart in Data Visualizer app', () => {
        cy.visit('/', EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))
        openSLDashboard('Delivery')
        openChartInDataVisualizerApp()
        expectChartToBeOpenedInDataVisualizerApp()
    })

    // FIXME
    it.skip('opens the interpretations panel', () => {
        cy.visit('/', EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))
        openSLDashboard('Delivery')

        clickMenuButton(dashboards.Delivery.items.chart.itemUid)
        cy.contains('Show details and interpretations').click()

        // the interpretations panel is displayed
        getDashboardItem(dashboards.Delivery.items.chart.itemUid)
            .find(itemDetailsSel)
            .contains('Visualization details')
            .scrollIntoView()
            .should('be.visible')

        getDashboardItem(dashboards.Delivery.items.chart.itemUid)
            .find(itemDetailsSel)
            .contains('Interpretations')
            .scrollIntoView()
            .should('be.visible')
    })

    it('text item does not have a context menu', () => {
        cy.visit('/', EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))
        openSLDashboard('Antenatal Care')

        // the text item does not have a context menu
        getDashboardItem(dashboards['Antenatal Care'].items.text.itemUid)
            .find(itemMenuButtonSel)
            .should('not.exist')
    })

    it('chart item has a fullscreen option', () => {
        cy.visit('/', EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))
        openSLDashboard('Antenatal Care')

        // chart item has fullscreen option
        clickMenuButton(dashboards['Antenatal Care'].items.chart.itemUid)
        cy.contains('View fullscreen').should('be.visible')
    })
})
