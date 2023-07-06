import { When, Then } from '@badeball/cypress-cucumber-preprocessor'
import {
    dragHandleSel,
    dashboardsBarSel,
} from '../../../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT } from '../../../support/utils.js'

// Scenario: I change the height of the control bar
When('I drag to increase the height of the control bar', () => {
    cy.intercept('PUT', '**/userDataStore/dashboard/controlBarRows').as(
        'putRows'
    )
    cy.get(dragHandleSel, EXTENDED_TIMEOUT).as('dragHandleSel')

    cy.get('@dragHandleSel').trigger('mousedown')
    cy.get('@dragHandleSel').trigger('mousemove', { clientY: 300 })
    cy.get('@dragHandleSel').trigger('mouseup')

    cy.wait('@putRows').its('response.statusCode').should('eq', 201)
})

Then('the control bar height should be updated', () => {
    cy.visit('/')
    cy.get(dashboardsBarSel, EXTENDED_TIMEOUT)
        .invoke('height')
        .should('eq', 231)

    // restore the original height
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get(dragHandleSel)
        .trigger('mousedown')
        .trigger('mousemove', { clientY: 71 })
        .trigger('mouseup')
    cy.wait('@putRows').its('response.statusCode').should('eq', 201)
})

When('I drag to decrease the height of the control bar', () => {
    cy.intercept('PUT', '**/userDataStore/dashboard/controlBarRows').as(
        'putRows'
    )
    cy.get(dragHandleSel, EXTENDED_TIMEOUT).as('dragHandleSel')

    cy.get('@dragHandleSel').trigger('mousedown')
    cy.get('@dragHandleSel').trigger('mousemove', { clientY: 300 })
    cy.get('@dragHandleSel').trigger('mouseup')

    cy.wait('@putRows').its('response.statusCode').should('eq', 201)
})
