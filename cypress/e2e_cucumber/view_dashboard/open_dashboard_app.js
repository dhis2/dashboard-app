import { When, Then } from '@badeball/cypress-cucumber-preprocessor'
import { dashboardTitleSel } from '../../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT } from '../../support/utils.js'

When('I open the dashboard app with the root url', () => {
    cy.visit('/', EXTENDED_TIMEOUT)

    cy.location().should((loc) => {
        expect(loc.hash).to.equal('#/')
    })

    cy.get(dashboardTitleSel).should('be.visible')
})

Then('the {string} dashboard displays', (title) => {
    cy.get(dashboardTitleSel).should('be.visible').and('contain', title)
    cy.location().should((loc) => {
        expect(loc.hash).to.equal('#/')
    })
})
