import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import {
    dragHandleSel,
    dashboardsBarSel,
} from '../../../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT } from '../../../support/utils.js'

const RESP_CODE_200 = 200
const RESP_CODE_201 = 201

// Scenario: I change the height of the control bar
When('I drag to increase the height of the control bar', () => {
    cy.intercept('PUT', '/userDataStore/dashboard/controlBarRows').as('putRows')
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get(dragHandleSel, EXTENDED_TIMEOUT)
        .trigger('mousedown')
        .trigger('mousemove', { clientY: 300 })
        .trigger('mouseup')

    cy.wait('@putRows')
        .its('response.statusCode')
        .should('be.oneOf', [RESP_CODE_200, RESP_CODE_201])
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
    cy.wait('@putRows')
        .its('response.statusCode')
        .should('be.oneOf', [RESP_CODE_200, RESP_CODE_201])
})

When('I drag to decrease the height of the control bar', () => {
    cy.intercept('PUT', '/userDataStore/dashboard/controlBarRows').as('putRows')
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get(dragHandleSel, EXTENDED_TIMEOUT)
        .trigger('mousedown')
        .trigger('mousemove', { clientY: 300 })
        .trigger('mouseup')

    cy.wait('@putRows')
        .its('response.statusCode')
        .should('be.oneOf', [RESP_CODE_200, RESP_CODE_201])
})
