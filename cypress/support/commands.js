Cypress.Commands.add('getBySel', (selector, ...args) =>
    cy.get(`[data-test="${selector}"]`, ...args)
)

Cypress.Commands.add('getBySelLike', (selector, ...args) =>
    cy.get(`[data-test*="${selector}"]`, ...args)
)

Cypress.Commands.add(
    'findBySel',
    {
        prevSubject: true,
    },
    (subject, selector, ...args) =>
        cy.wrap(subject).find(`[data-test="${selector}"]`, ...args)
)

Cypress.Commands.add(
    'findBySelLike',
    {
        prevSubject: true,
    },
    (subject, selector, ...args) =>
        cy.wrap(subject).find(`[data-test*="${selector}"]`, ...args)
)

Cypress.Commands.add(
    'containsExact',
    {
        prevSubject: 'optional',
    },
    (subject, selector) =>
        cy.wrap(subject).contains(
            new RegExp(
                `^${selector.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, //eslint-disable-line no-useless-escape
                'gm'
            )
        )
)

Cypress.Commands.add(
    'closePopper',
    {
        prevSubject: true,
    },
    (subject) =>
        cy
            .wrap(subject)
            .closest('[data-test=dhis2-uicore-layer]')
            .click('topLeft')
)
