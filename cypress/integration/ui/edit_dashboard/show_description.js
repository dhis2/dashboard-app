import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import { dashboardDescriptionSel } from '../../../selectors/viewDashboard'

Then('the dashboard description should not be displayed', () => {
    cy.get(dashboardDescriptionSel).should('not.exist')
})

Then('the dashboard description should be displayed', () => {
    cy.get(dashboardDescriptionSel).should('be.visible')
})

When('I click to show description', () => {
    cy.intercept('PUT', 'userDataStore/dashboard/showDescription').as(
        'toggleDescription'
    )

    cy.get('button').contains('More').click()
    cy.contains('Show description').click()

    cy.wait('@toggleDescription').its('response.statusCode').should('eq', 201)
})

When('I click to hide the description', () => {
    cy.get('button').contains('More').click()
    cy.contains('Hide description').click()

    cy.wait('@toggleDescription').its('response.statusCode').should('eq', 201)
})
