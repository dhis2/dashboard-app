import { dashboards } from '../assets/backends/index.js'
// import { gridItemSel, chartSel } from '../elements/dashboardItem.js'
import { getNavigationMenuItem } from '../elements/navigationMenu.js'
import { dashboardTitleSel, newButtonSel } from '../elements/viewDashboard.js'


describe('view dashboard', () => {
    it('there are no dashboards', () => {
        cy.intercept('**/dashboards?*', { body: { dashboards: [] } })
        cy.visit('/')

        cy.contains('No dashboards found').should('be.visible')
        cy.get(newButtonSel).should('be.visible')

        // check the Navigation Menu
    })

    it('dashboard not found', () => {
        cy.visit('#/invalid')

        cy.contains('Requested dashboard not found').should('be.visible')

        // When I open the "Delivery" dashboard
        // Then the "Delivery" dashboard displays in view mode
    })

    // Scenario: I switch between dashboards
    //     Given I open the "Delivery" dashboard
    //     When I open the "Immunization" dashboard
    //     Then the "Immunization" dashboard displays in view mode
    it.only('switch between dashboards', () => {
        const title = 'Delivery'
        // open the Delivery dashboard
        cy.visit('/')
        getNavigationMenuItem(title).click()
        
        cy.location().should((loc) => {
            expect(loc.hash).to.equal(dashboards[title].route)
        })
        
        cy.get(dashboardTitleSel).should('be.visible').and('contain', title)
            // cy.get(`${gridItemSel}.VISUALIZATION`)
            //     .first()
            //     .getIframeBody()
            //     .find(chartSel, EXTENDED_TIMEOUT)
            //     .as('vis')
            // cy.get('@vis').should('exist')

    })

})
