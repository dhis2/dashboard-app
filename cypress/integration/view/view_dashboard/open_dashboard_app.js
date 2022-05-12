import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import {
    dashboardTitleSel,
    dashboardChipSel,
} from '../../../elements/viewDashboard'
import { EXTENDED_TIMEOUT } from '../../../support/utils'

When('I open the dashboard app with the root url', () => {
    cy.visit('/', EXTENDED_TIMEOUT)

    cy.location().should((loc) => {
        expect(loc.hash).to.equal('#/')
    })

    cy.get(dashboardTitleSel).should('be.visible')
    cy.get(dashboardChipSel, EXTENDED_TIMEOUT).should('be.visible')
})

Then('the {string} dashboard displays', (title) => {
    cy.get(dashboardTitleSel).should('be.visible').and('contain', title)
    cy.location().should((loc) => {
        expect(loc.hash).to.equal('#/')
    })
})
