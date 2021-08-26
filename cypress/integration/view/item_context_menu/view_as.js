import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import { dashboards } from '../../../assets/backends'
import {
    chartSel,
    mapSel,
    tableSel,
    clickMenuButton,
    getDashboardItem,
} from '../../../elements/dashboardItem'
import { EXTENDED_TIMEOUT } from '../../../support/utils'

// these tests being run on the "Delivery" dashboard
const chartItemUid = dashboards.Delivery.items.chart.itemUid
const tableItemUid = dashboards.Delivery.items.table.itemUid

/*
Background
*/

Then('the chart dashboard item displays as a chart', () => {
    getDashboardItem(chartItemUid)
        .find(chartSel, EXTENDED_TIMEOUT)
        .should('exist')
        .and('be.visible')
})

Then('the table dashboard item displays as a table', () => {
    getDashboardItem(tableItemUid)
        .find(tableSel, EXTENDED_TIMEOUT)
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
        .find(tableSel, EXTENDED_TIMEOUT)
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
        .find(mapSel, EXTENDED_TIMEOUT)
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
        .find(chartSel, EXTENDED_TIMEOUT)
        .should('exist')
        .and('be.visible')
})
