import { dashboards } from '../assets/backends/index.js'
import {
    getNavigationMenuDropdown,
    getNavigationMenuItem,
    closeNavigationMenu,
    getNavigationMenuFilter,
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
        const title = 'Cases Malaria'
        getNavigationMenuItem(title).click()
        assertDashboardDisplayed(title)

        // open the Immunization dashboard
        const newTitle = 'Immunization'
        getNavigationMenuItem(newTitle).click()
        assertDashboardDisplayed(newTitle)
    })

    it('search for a dashboard', () => {
        cy.visit('/')

        // open the Antenatal Care dashboard
        const title = 'Antenatal Care'
        getNavigationMenuItem(title).click()
        assertDashboardDisplayed(title)

        // search for Immun
        getNavigationMenuFilter().type('Immun')
        getNavigationMenuItem('Immunization', true).should('be.visible')
        getNavigationMenuItem('Immunization data', true).should('be.visible')
        getNavigationMenuItem('Delivery', true).should('not.exist')

        // open the Immunization dashboard
        getNavigationMenuItem('Immunization', true).click()
        assertDashboardDisplayed('Immunization')
    })

    it('search for a dashboard with nonmatching search text', () => {
        cy.visit('/')

        // open the Antenatal Care dashboard
        const title = 'Antenatal Care'
        getNavigationMenuItem(title).click()
        assertDashboardDisplayed(title)

        // search for Noexist
        getNavigationMenuFilter().type('xyzpdq')
        cy.getByDataTest('navmenu-no-items-found')
            .should('be.visible')
            .and('contain', 'No dashboards found for "xyzpdq"')
    })

    it('user preferred dashboard', () => {
        cy.visit('/')

        // open the Antenatal Care dashboard
        getNavigationMenuItem('Antenatal Care').click()
        assertDashboardDisplayed('Antenatal Care')

        // open the Delivery dashboard
        getNavigationMenuItem('Delivery').click()
        assertDashboardDisplayed('Delivery')

        // open the root url which should display the Delivery dashboard
        cy.visit('/')
        cy.get(dashboardTitleSel)
            .should('be.visible')
            .and('contain', 'Delivery')
    })

    it('display dashboard with items lacking shape', () => {
        const title = 'Delivery'
        const regex = new RegExp(`dashboards/${dashboards[title].id}`, 'g')
        cy.intercept(regex, (req) => {
            req.reply((res) => {
                res.body.dashboardItems.forEach((item) => {
                    delete item.x
                    delete item.y
                    delete item.w
                    delete item.h
                })

                res.send({ body: res.body })
            })
        })
        getNavigationMenuItem(title).click()

        assertDashboardDisplayed('Delivery')
    })
})
