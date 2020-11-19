export const expectDashboardTitleToContain = name => {
    cy.get('[data-test="view-dashboard-title"]')
        .scrollIntoView()
        .should('be.visible')
        .and('contain', name)
}
