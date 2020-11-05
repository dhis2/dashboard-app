// Cypress.Commands.add(name, callbackFn)
// Cypress.Commands.add(name, options, callbackFn)

Cypress.Commands.add('clickChip', name => {
    cy.get('[data-test="dhis2-uicore-chip"]')
        .contains(name)
        .click()
})

Cypress.Commands.add('clickContextMenu', name => {
    cy.get(`[data-test="dhis2-dashboard-dashboard-item-prog-${name}"]`)
        .find('[data-test="dhis2-dashboard-item-context-menu"]')
        .click()
})

Cypress.Commands.add('clickViewAsChart', () => {
    cy.get('[data-test="dhis2-dashboard-item-viewas-chart"]').click()
})

Cypress.Commands.add('clickViewAsTable', () => {
    cy.get('[data-test="dhis2-dashboard-item-viewas-table"]').click()
})

Cypress.Commands.add('checkDashboardTitle', name => {
    cy.get('[data-test="dhis2-dashboard-view-dashboard-title"]')
        .scrollIntoView()
        .should('be.visible')
        .and('contain', name)
})

Cypress.Commands.add('checkUrlLocation', name => {
    cy.location().should(loc => {
        expect(loc.hash).to.equal(name)
    })
})

Cypress.Commands.add('checkChartExists', name => {
    if (name) {
        cy.get(`[data-test="dhis2-dashboard-dashboard-item-prog-${name}"]`)
            .find('.highcharts-container')
            .should('exist')
            .and('be.visible')
    } else {
        cy.get('.highcharts-container')
            .should('exist')
            .and('be.visible')
    }
})

Cypress.Commands.add('checkTableExists', name => {
    cy.get(`[data-test="dhis2-dashboard-dashboard-item-prog-${name}"]`)
        .find('.pivot-table-container')
        .should('exist')
        .and('be.visible')
})

Cypress.Commands.add('checkTableDoesNotExist', name => {
    cy.get(`[data-test="dhis2-dashboard-dashboard-item-prog-${name}"]`)
        .find('.pivot-table-container')
        .should('not.exist')
})

Cypress.Commands.add('checkChartDoesNotExist', name => {
    cy.get(`[data-test="dhis2-dashboard-dashboard-item-prog-${name}"]`)
        .find('.highcharts-container')
        .should('not.exist')
})
