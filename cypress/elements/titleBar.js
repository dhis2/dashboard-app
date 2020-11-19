export const expectDashboardTitleToContain = name => {
    cy.get('[data-test="view-dashboard-title"]')
        .scrollIntoView()
        .should('be.visible')
        .and('contain', name)
}

const clickEdit = () => {
    cy.get('[data-test="link-edit-dashboard"]').click()
}

export const titleBar = {
    clickEdit,
}
