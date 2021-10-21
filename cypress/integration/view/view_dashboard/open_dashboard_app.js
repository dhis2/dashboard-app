import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import {
    dashboardTitleSel,
    dashboardChipSel,
} from '../../../elements/viewDashboard'
import { EXTENDED_TIMEOUT } from '../../../support/utils'

When('I open the dashboard app', () => {
    const url = `${Cypress.config().baseUrl}/#/`
    cy.window().then(win => {
        win.location.assign(url)
        cy.wait(2000) // eslint-disable-line cypress/no-unnecessary-waiting
    })

    cy.location().should(loc => {
        expect(loc.hash).to.equal('#/')
    })

    cy.get(dashboardTitleSel).should('be.visible')
    cy.get(dashboardChipSel, EXTENDED_TIMEOUT).should('be.visible')
})

Then('the {string} dashboard displays', title => {
    cy.get(dashboardTitleSel).should('be.visible').and('contain', title)
    cy.location().should(loc => {
        expect(loc.hash).to.equal('#/')
    })
})
