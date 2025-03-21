import { dashboards } from '../assets/backends/index.js'
import { getNavigationMenuItem } from '../elements/navigationMenu.js'
import { dashboardTitleSel } from '../elements/viewDashboard.js'

const assertViewMode = (title) => {
    cy.location().should((loc) => {
        expect(loc.hash).to.equal(dashboards[title].route)
    })
    cy.getByDataTest('headerbar-title').should('be.visible')
    cy.get(dashboardTitleSel).should('be.visible').and('contain', title)
}

describe('view dashboard', () => {
    it('should open the dashboard', () => {
        cy.visit('/')
        cy.getByDataTest('view-dashboard-title').should('be.visible')
        cy.getByDataTest('headerbar-title').should('be.visible')
    })

    // Scenario: I view the print layout preview and then print one-item-per-page preview
    //     Then the "Delivery" dashboard displays in view mode
    it('should view the print layout preview and then print one-item-per-page preview', () => {
        const title = 'Delivery'
        cy.visit('/')
        getNavigationMenuItem(title).click()

        assertViewMode(title)

        // open print layout
        cy.getByDataTest('more-actions-button').click()
        cy.getByDataTest('print-menu-item').click()
        cy.getByDataTest('print-layout-menu-item').click()

        // check that print layout is shown
        cy.location().should((loc) => {
            expect(loc.hash).to.equal(`${dashboards[title].route}/printlayout`)
        })
        cy.getByDataTest('headerbar-title').should('not.be.visible')
        cy.getByDataTest('print-layout-page').should('be.visible')

        // exit print preview
        cy.get('button').not('.small').contains('Exit print preview').click()
        assertViewMode(title)

        // open print one-item-per-page
        cy.getByDataTest('more-actions-button').click()
        cy.getByDataTest('print-menu-item').click()
        cy.getByDataTest('print-oipp-menu-item').click()

        // check that print oipp is shown
        cy.location().should((loc) => {
            expect(loc.hash).to.equal(`${dashboards[title].route}/printoipp`)
        })
        cy.getByDataTest('headerbar-title').should('not.be.visible')
        cy.getByDataTest('print-oipp-page').should('be.visible')

        // exit print preview
        cy.get('button').not('.small').contains('Exit print preview').click()

        // check that we are back to the dashboard view mode
        assertViewMode(title)
    })
})
