export const getNavigationMenuDropdown = () =>
    cy.get('[data-test="dashboards-nav-menu-button"]')

export const getNavigationMenu = (isOpen = false) => {
    if (!isOpen) {
        getNavigationMenuDropdown().click()
    }
    return cy.get('[role="menu"]')
}

export const getNavigationMenuItem = (dashboardDisplayName, isOpen) =>
    getNavigationMenu(isOpen).find('li').contains(dashboardDisplayName)

export const closeNavigationMenu = () => {
    cy.get('.backdrop').click()
    cy.get('.backdrop').should('not.exist')
}

export const getNavigationMenuFilter = (isOpen) => {
    if (!isOpen) {
        getNavigationMenuDropdown().click()
    }
    return cy.get('input:visible[placeholder="Search for a dashboard"]')
}
