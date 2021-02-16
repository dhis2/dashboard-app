import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import {
    dragHandleSel,
    dashboardsBarSel,
} from '../../../selectors/viewDashboard'

// Scenario: I change the height of the control bar
When('I drag to change increase the height of the control bar', () => {
    cy.intercept('PUT', '/userDataStore/dashboard/controlBarRows').as('putRows')
    cy.get(dragHandleSel)
        .trigger('mousedown')
        .trigger('mousemove', { clientY: 300 })
        .trigger('mouseup')

    cy.wait('@putRows').its('response.statusCode').should('eq', 201)
})

Then('the control bar height should be updated', () => {
    cy.visit('/')
    cy.get(dashboardsBarSel)
        .invoke('height')
        .then(h => {
            expect(h).to.equal(231)
        })

    // restore the original height
    cy.get(dragHandleSel)
        .trigger('mousedown')
        .trigger('mousemove', { clientY: 71 })
        .trigger('mouseup')
    cy.wait('@putRows').its('response.statusCode').should('eq', 201)
})
