import { dashboards } from '../assets/backends/index.js'
import {
    getNavigationMenuDropdown,
    getNavigationMenuItem,
    closeNavigationMenu,
} from '../elements/navigationMenu.js'
import { dashboardTitleSel, newButtonSel } from '../elements/viewDashboard.js'

const assertDashboardDisplayed = (title) => {
    cy.location().should((loc) => {
        expect(loc.hash).to.equal(dashboards[title].route)
    })
    cy.get(dashboardTitleSel).should('be.visible').and('contain', title)
}

describe('view dashboard', () => {
    it('there are no dashboards', () => {
        cy.intercept('**/dashboards?*', { body: { dashboards: [] } })
        cy.visit('/')

        // check that main dashboard area shows the no dashboards message
        cy.contains('No dashboards found').should('be.visible')
        cy.get(newButtonSel).should('be.visible')

        // check that NavigationMenu shows the no dashboards message
        getNavigationMenuDropdown().click()
        cy.getByDataTest('navmenu-no-dashboards-message').should('be.visible')
        closeNavigationMenu()
    })

    it('dashboard not found', () => {
        cy.visit('#/invalid')

        cy.contains('Requested dashboard not found').should('be.visible')

        // Open the Delivery dashboard
        const title = 'Delivery'
        getNavigationMenuItem(title).click()
        assertDashboardDisplayed(title)
    })

    it('switch between dashboards', () => {
        cy.visit('/')

        // open the Delivery dashboard
        const title = 'Delivery'
        getNavigationMenuItem(title).click()
        assertDashboardDisplayed(title)

        // open the Immunization dashboard
        const newTitle = 'Immunization'
        getNavigationMenuItem(newTitle).click()
        assertDashboardDisplayed(newTitle)
    })
})
