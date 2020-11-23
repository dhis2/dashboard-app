import { Given, Then } from 'cypress-cucumber-preprocessor/steps'
import { dashboards } from '../../assets/backends'

beforeEach(() => {
    cy.visit('/', {
        timeout: 15000,
    })
})

Given('I open the {string} dashboard', title => {
    cy.get('[data-test="dashboard-chip"]', {
        timeout: 15000,
    })
        .contains(title)
        .click()
})

Then('the {string} dashboard displays in view mode', title => {
    cy.location().should(loc => {
        expect(loc.hash).to.equal(dashboards[title].route)
    })

    cy.get('[data-test="view-dashboard-title"]')
        .should('be.visible')
        .and('contain', title)
    cy.get('.highcharts-background').should('exist')
})
