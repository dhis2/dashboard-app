import { EXTENDED_TIMEOUT } from '../support/utils.js'

describe('Smoke test', () => {
    it('opens the app', () => {
        cy.visit('/', EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))
        cy.getBySel('dashboard-chip').contains('Delivery').click()

        cy.getBySel('view-dashboard-title')
            .contains('Delivery')
            .should('be.visible')
    })
})
