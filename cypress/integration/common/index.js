import { Given, Then } from 'cypress-cucumber-preprocessor/steps'

const deliveryDashboardRoute = '#/iMnYyBfSxmM'

beforeEach(() => {
    cy.visit('/')
})

Given('I open the Delivery dashboard', () => {
    cy.clickChip('Delivery')
})

Then('the Delivery dashboard displays in view mode', () => {
    cy.checkUrlLocation(deliveryDashboardRoute)
    cy.checkDashboardTitle('Delivery')
    cy.checkChartExists()
})
