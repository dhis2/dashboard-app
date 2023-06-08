import { dashboardTitleSel } from '../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT } from '../support/utils.js'

const USER_NAME = 'Kevin Boateng'

// When('I change sharing settings', () => {
export const changeSharingSettings = () => {
    cy.get('button').contains('Share', EXTENDED_TIMEOUT).click()

    //confirm that Boateng is not currently listed
    cy.get('hr').should('have.length', 3)

    cy.get('[placeholder="Enter names"]').scrollIntoView()
    cy.get('[placeholder="Enter names"]').type('Boateng')
    cy.contains(USER_NAME).click()

    cy.get('div').contains(USER_NAME).should('be.visible')

    cy.get('button').contains('close', { matchCase: false }).click()
}

// Then('the new sharing settings should be preserved', () => {
export const newSharingSettingsArePreserved = () => {
    cy.visit('/')
    cy.getBySel(dashboardTitleSel, EXTENDED_TIMEOUT).should('be.visible')
    cy.get('button').contains('Share', EXTENDED_TIMEOUT).should('be.visible')
    cy.get('button').contains('Share', EXTENDED_TIMEOUT).click()

    cy.get('hr').should('have.length', 4)
    cy.get('div').contains(USER_NAME, EXTENDED_TIMEOUT).should('be.visible')
}
