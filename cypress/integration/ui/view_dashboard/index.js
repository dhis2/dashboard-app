import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

// const antenatalCareDashboardRoute = '#/nghVC4wtyzi'
const immunizationDashboardRoute = '#/TAMlzYkstb7'
const deliveryDashboardRoute = '#/iMnYyBfSxmM'

const DASHBOARD_ITEM_CHART_UID = 'GaVhJpqABYX'
const DASHBOARD_ITEM_TABLE_UID = 'qXsjttMYuoZ'
// const DASHBOARD_ITEM_MAP_UID = 'G3EtzSWNP9o'

beforeEach(() => {
    cy.visit('/')
})

Given('I open the Delivery dashboard', () => {
    cy.clickChip('Delivery')
})

When('I select the Immunization dashboard', () => {
    cy.clickChip('Immun')
})

Then('the Immunization dashboard displays in view mode', () => {
    cy.checkUrlLocation(immunizationDashboardRoute)
    cy.checkDashboardTitle('Immunization')
    cy.checkChartExists()
})

Then('the Delivery dashboard displays in view mode', () => {
    cy.checkUrlLocation(deliveryDashboardRoute)
    cy.checkDashboardTitle('Delivery')
    cy.checkChartExists()
})

When('I search for dashboards containing Immun', () => {
    cy.get('[data-test="dhis2-dashboard-search-dashboard-input"]').type('Immun')
})

Then('Immunization and Immunization data dashboards are choices', () => {
    cy.get('[data-test="dhis2-uicore-chip"]')
        .should('be.visible')
        .and('have.length', 2)
})

When('I press enter in the search dashboard field', () => {
    cy.get('[data-test="dhis2-dashboard-search-dashboard-input"]').type(
        '{enter}'
    )
})

When('I click to preview the print layout', () => {
    cy.get('[data-test="dhis2-dashboard-more-button"]').click()
    cy.get('[data-test="dhis2-dashboard-print-menu-item"]').click()
    cy.get('[data-test="dhis2-dashboard-print-layout-menu-item"]').click()
})

Then('the print layout displays', () => {
    cy.checkUrlLocation(`${deliveryDashboardRoute}/printlayout`)
    cy.get('[data-test="dhis2-dashboard-print-layout-page"]').should(
        'be.visible'
    )
})

When('I click to exit print preview', () => {
    cy.get('[data-test="dhis2-dashboard-exit-print-preview"]').click()
})

When('I click to preview the print one-item-per-page', () => {
    cy.get('[data-test="dhis2-dashboard-more-button"]').click()
    cy.get('[data-test="dhis2-dashboard-print-menu-item"]').click()
    cy.get('[data-test="dhis2-dashboard-print-oipp-menu-item"]').click()
})

Then('the print one-item-per-page displays', () => {
    cy.checkUrlLocation(`${deliveryDashboardRoute}/printoipp`)
    cy.get('[data-test="dhis2-dashboard-print-oipp-page"]').should('be.visible')
})

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
