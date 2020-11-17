import { When, Then } from 'cypress-cucumber-preprocessor/steps'

const DASHBOARD_ITEM_CHART_UID = 'GaVhJpqABYX'
const DASHBOARD_ITEM_TABLE_UID = 'qXsjttMYuoZ'
// const DASHBOARD_ITEM_MAP_UID = 'G3EtzSWNP9o'

When('I click View As Table on a chart dashboard item', () => {
    cy.clickContextMenu(DASHBOARD_ITEM_CHART_UID)
    cy.clickViewAsTable(DASHBOARD_ITEM_CHART_UID)
})

When('I click View As Chart on a table dashboard item', () => {
    cy.clickContextMenu(DASHBOARD_ITEM_TABLE_UID)
    cy.clickViewAsChart(DASHBOARD_ITEM_TABLE_UID)
})

When('I click View As Map on a chart dashboard item', () => {
    cy.clickContextMenu(DASHBOARD_ITEM_CHART_UID)
    cy.clickViewAsMap()
})
Then('the chart dashboard item displays as a map', () => {
    cy.checkChartDoesNotExist(DASHBOARD_ITEM_CHART_UID)
    cy.checkMapExists(DASHBOARD_ITEM_CHART_UID)
})

Then('the chart dashboard item displays as a chart', () => {
    cy.checkChartExists(DASHBOARD_ITEM_CHART_UID)
    cy.checkTableDoesNotExist(DASHBOARD_ITEM_CHART_UID)
})

Then('the chart dashboard item displays as a table', () => {
    cy.checkChartDoesNotExist(DASHBOARD_ITEM_CHART_UID)
    cy.checkTableExists(DASHBOARD_ITEM_CHART_UID)
})

Then('the table dashboard item displays as a chart', () => {
    cy.checkChartExists(DASHBOARD_ITEM_TABLE_UID)
    cy.checkTableDoesNotExist(DASHBOARD_ITEM_TABLE_UID)
})

Then('the table dashboard item displays as a table', () => {
    cy.checkChartDoesNotExist(DASHBOARD_ITEM_TABLE_UID)
    cy.checkTableExists(DASHBOARD_ITEM_TABLE_UID)
})
