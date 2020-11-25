import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import {
    chartSel,
    mapSel,
    tableSel,
    itemDetailsSel,
    clickMenuButton,
    getDashboardItem,
} from '../../../elements/dashboardItem'
import { dashboards } from '../../../assets/backends'

// these tests being run on the "Delivery" dashboard
const chartItemUid = dashboards.Delivery.items.chart.itemUid
const tableItemUid = dashboards.Delivery.items.table.itemUid
const chartItemVisUrl = `dhis-web-data-visualizer/#/${dashboards.Delivery.items.chart.visUid}`

/*
Background
*/

Then('the chart dashboard item displays as a chart', () => {
    getDashboardItem(chartItemUid)
        .find(chartSel)
        .should('exist')
        .and('be.visible')
})

Then('the table dashboard item displays as a table', () => {
    getDashboardItem(tableItemUid)
        .find(tableSel)
        .should('exist')
        .and('be.visible')
})

/*
Scenario: View chart as table
*/

When('I click View As Table on a chart dashboard item', () => {
    clickMenuButton(chartItemUid)
    cy.contains('View as Table').click()
})

Then('the chart dashboard item displays as a table', () => {
    getDashboardItem(chartItemUid)
        .find(tableSel)
        .should('exist')
        .and('be.visible')
})

/*
Scenario: View chart as map
*/

When('I click View As Map on a chart dashboard item', () => {
    clickMenuButton(chartItemUid)
    cy.contains('View as Map').click()
})

Then('the chart dashboard item displays as a map', () => {
    getDashboardItem(chartItemUid)
        .find(mapSel)
        .should('exist')
        .and('be.visible')
})

/*
Scenario: View table as chart
*/

When('I click View As Chart on a table dashboard item', () => {
    clickMenuButton(tableItemUid)
    cy.contains('View as Chart').click()
})

Then('the table dashboard item displays as a chart', () => {
    getDashboardItem(tableItemUid)
        .find(chartSel)
        .should('exist')
        .and('be.visible')
})

/*
Scenario: Open chart in Data Visualizer app
*/

When('I click Open in Data Visualizer app on a chart dashboard item', () => {
    clickMenuButton(chartItemUid)

    cy.contains('Open in Data Visualizer app')
        .should('have.attr', 'href')
        .and('include', chartItemVisUrl)

    /**
     * Since Cypress cannot work with multiple tabs and more
     * than one domain in a single test, modify the link to:
     *  1) open in the current Cypress tab instead of new tab
     *  2) open on the test domain instead of the api domain
     */
    cy.contains('Open in Data Visualizer app')
        .invoke('removeAttr', 'target')
        .invoke(
            'attr',
            'href',
            `${Cypress.config().baseUrl}/${chartItemVisUrl}`
        )
        .click()
})

Then('the chart is opened in the Data Visualizer app', () => {
    // This url is a 404, but the goal is to confirm that
    // clicking on the link actually navigates to another url.
    cy.url().should('include', chartItemVisUrl)
})

/*
Scenario: Open the interpretations panel
*/

When(
    'I click Show interpretations and details on a chart dashboard item',
    () => {
        clickMenuButton(chartItemUid)
        cy.contains('Show interpretations and details').click()
    }
)
Then('the interpretations panel is displayed', () => {
    getDashboardItem(chartItemUid)
        .find(itemDetailsSel)
        .contains('Chart details')
        .scrollIntoView()
        .should('be.visible')

    getDashboardItem(chartItemUid)
        .find(itemDetailsSel)
        .contains('Interpretations')
        .scrollIntoView()
        .should('be.visible')
})
