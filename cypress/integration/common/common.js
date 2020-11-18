import { Given, Then } from 'cypress-cucumber-preprocessor/steps'

// const deliveryDashboardRoute = '#/iMnYyBfSxmM'

beforeEach(() => {
    cy.visit('/')
})

Given('I open the {string} dashboard', title => {
    cy.clickChip(title)
})

Then('the {string} dashboard displays in view mode', title => {
    // cy.checkUrlLocation(deliveryDashboardRoute)
    cy.checkDashboardTitle(title)
    cy.checkChartExists()
})
