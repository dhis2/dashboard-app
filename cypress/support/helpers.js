Cypress.Commands.add('buildApiUrl', (...urlParts) =>
    [Cypress.env('DHIS2_BASE_URL'), 'api', ...urlParts]
        .map(part => part.replace(/(^\/)|(\/$)/, ''))
        .join('/')
)

Cypress.Commands.add(
    'shouldIncludeClass',
    { prevSubject: true },
    (subject, className) =>
        cy
            .wrap(subject)
            .invoke('attr', 'class')
            .should('contain', className)
)

Cypress.Commands.add('loginThroughForm', () => {
    const username = Cypress.env('DHIS2_USERNAME')
    const password = Cypress.env('DHIS2_PASSWORD')
    return cy.visit('/').then(() => {
        cy.get('#server').type('http://localhost:8080')
        cy.get('#j_username').type(username)
        cy.get('#j_password').type(password)
        cy.get('form').submit()
    })
})
