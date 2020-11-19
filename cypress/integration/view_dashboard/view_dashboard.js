import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import { expectUrlToMatch } from '../../elements/browserUrl'
import { dashboardsBar } from '../../elements/dashboardsBar'
import { expectDashboardTitleToContain } from '../../elements/titleBar'
import { expectChartToExist } from '../../elements/dashboardItem'

const deliveryDashboardRoute = '#/iMnYyBfSxmM'

When('I select the Immunization dashboard', () => {
    dashboardsBar.clickChip('Immun')
})

When('I search for dashboards containing Immun', () => {
    cy.get('[data-test="search-dashboard-input"]').type('Immun')
})

Then('Immunization and Immunization data dashboards are choices', () => {
    cy.get('[data-test="dhis2-uicore-chip"]')
        .should('be.visible')
        .and('have.length', 2)
})

When('I press enter in the search dashboard field', () => {
    cy.get('[data-test="search-dashboard-input"]').type('{enter}')
})

When('I click to preview the print layout', () => {
    cy.get('[data-test="more-button"]').click()
    cy.get('[data-test="print-menu-item"]').click()
    cy.get('[data-test="print-layout-menu-item"]').click()
})

Then('the print layout displays', () => {
    expectUrlToMatch(`${deliveryDashboardRoute}/printlayout`)
    cy.get('[data-test="print-layout-page"]').should('be.visible')
})

When('I click to exit print preview', () => {
    cy.get('[data-test="exit-print-preview"]').click()
})

When('I click to preview the print one-item-per-page', () => {
    cy.get('[data-test="more-button"]').click()
    cy.get('[data-test="print-menu-item"]').click()
    cy.get('[data-test="print-oipp-menu-item"]').click()
})

Then('the print one-item-per-page displays', () => {
    expectUrlToMatch(`${deliveryDashboardRoute}/printoipp`)
    cy.get('[data-test="print-oipp-page"]').should('be.visible')
})

When('I search for dashboards containing Noexist', () => {
    cy.get('[data-test="search-dashboard-input"]').type('Noexist')
})

Then('no dashboards are choices', () => {
    cy.get('[data-test="dhis2-uicore-chip"]').should('not.be.visible')
})

Then("dashboards list restored and dashboard doesn't change", () => {
    cy.get('[data-test="dhis2-uicore-chip"]')
        .should('be.visible')
        .and('have.lengthOf.above', 0)

    expectUrlToMatch(deliveryDashboardRoute)
    expectDashboardTitleToContain('Delivery')
    expectChartToExist()
})
