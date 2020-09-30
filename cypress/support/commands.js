Cypress.Commands.add('loginThroughForm', () => {
    return cy.visit('/').then(() => {
        cy.get('#server').type(Cypress.env('dhis2_base_url'))
        cy.get('#j_username').type(Cypress.env('dhis2_username'))
        cy.get('#j_password').type(Cypress.env('dhis2_password'))
        cy.get('form').submit()
    })
})
