import { dragHandleSel, dashboardsBarSel } from '../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT } from '../support/utils.js'

export const resizeDashboardsBarUp = () => {
    cy.intercept('PUT', '**/userDataStore/dashboard/controlBarRows').as(
        'putRows'
    )
    cy.get(dragHandleSel, EXTENDED_TIMEOUT)
        .trigger('mousedown')
        .trigger('mousemove', { clientY: 300 })
        .trigger('mouseup')

    cy.wait('@putRows').its('response.statusCode').should('eq', 201)
}

export const expectDashboardsBarHeightToBeUpdated = () => {
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
}

export const resizeDashboardsBarDown = () => {
    cy.intercept('PUT', '**/userDataStore/dashboard/controlBarRows').as(
        'putRows'
    )
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get(dragHandleSel, EXTENDED_TIMEOUT)
        .trigger('mousedown')
        .trigger('mousemove', { clientY: 300 })
        .trigger('mouseup')

    cy.wait('@putRows').its('response.statusCode').should('eq', 201)
}
