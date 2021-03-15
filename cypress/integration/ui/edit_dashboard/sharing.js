import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import { EXTENDED_TIMEOUT } from '../../../support/utils'
import { dashboardTitleSel } from '../../../selectors/viewDashboard'

When('I change sharing settings', () => {
    cy.get('button').contains('Share', EXTENDED_TIMEOUT).click()

    //confirm that Boateng is not currently listed
    cy.get('h6', EXTENDED_TIMEOUT)
        .next('hr')
        .next('div')
        .children('div')
        .should('have.length', 2)

    cy.get('[placeholder="Enter names"]').type('Boateng')
    cy.contains('Kevin Boateng').click()

    //Add him with View
    cy.get('div').contains('Kevin Boateng').should('be.visible')

    cy.get('button').contains('close', { matchCase: false }).click()
})
Then('the new sharing settings should be preserved', () => {
    cy.get(dashboardTitleSel, EXTENDED_TIMEOUT).should('be.visible')
    cy.get('button').contains('Share', EXTENDED_TIMEOUT).click()
    cy.get('div')
        .contains('Kevin Boateng', EXTENDED_TIMEOUT)
        .should('be.visible')
})
