import { dashboards } from '../assets/backends/index.js'
import {
    getNavigationMenuItem,
    getNavigationMenuFilter,
    getNavigationMenu,
    dashboardTitleSel,
    confirmViewMode,
    getDashboardItem,
} from '../elements/index.js'
import { EXTENDED_TIMEOUT } from '../support/utils.js'

// const confirmViewMode = (title) => {
//     cy.location().should((loc) => {
//         expect(loc.hash).to.equal(dashboards[title].route)
//     })
//     cy.getByDataTest('headerbar-title').should('be.visible')
//     cy.get(dashboardTitleSel).should('be.visible').and('contain', title)
// }

describe('view dashboard', () => {
    it('switches between dashboards', () => {
        // Open the "Delivery" dashboard
        cy.visit('/')
        getNavigationMenuItem('Delivery').click()
        confirmViewMode('Delivery')
        cy.location().should((loc) => {
            expect(loc.hash).to.equal(dashboards.Delivery.route)
        })

        // Open the "Immunization" dashboard
        getNavigationMenuItem('Immunization').click()

        // Assert the "Immunization" dashboard displays in view mode
        confirmViewMode('Immunization')
        cy.location().should((loc) => {
            expect(loc.hash).to.equal(dashboards.Immunization.route)
        })
    })

    it('searches for a dashboard', () => {
        cy.visit('/')
        confirmViewMode()
        // Open the "Antenatal Care" dashboard
        getNavigationMenuItem('Antenatal Care').click()
        confirmViewMode('Antenatal Care')

        // Search for dashboards containing "Immun"
        getNavigationMenuFilter().type('Immun')

        // Assert Immunization and Immunization data dashboards are choices
        getNavigationMenu(true)
            .find('li')
            .should('be.visible')
            .and('have.length', 2)

        // Click on the Immunization data dashboard in the search results
        getNavigationMenu(true).contains('Immunization data').click()

        // Assert the "Immunization data" dashboard displays in view mode
        confirmViewMode('Immunization data')
    })

    it('searches for a dashboard with nonmatching search text', () => {
        cy.visit('/')
        // Open the "Antenatal Care" dashboard
        getNavigationMenuItem('Antenatal Care').click()
        confirmViewMode('Antenatal Care')

        // Search for dashboards containing "Noexist"
        getNavigationMenuFilter().type('Noexist')

        // Assert no dashboards are choices
        getNavigationMenu(true)
            .find('li')
            .contains('No dashboards found')
            .should('be.visible')
    })

    it('views a dashboard with items lacking shape', () => {
        // Intercept the dashboard request and remove shape properties
        const regex = new RegExp(`dashboards/${dashboards['Delivery'].id}`, 'g')
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

        // Open the "Delivery" dashboard with shapes removed
        cy.visit('/')
        getNavigationMenuItem('Delivery').click()

        // Assert the "Delivery" dashboard displays in view mode
        confirmViewMode('Delivery')
    })

    it("opens user's preferred dashboard", () => {
        // Open the "Antenatal Care" dashboard
        cy.visit('/')
        getNavigationMenuItem('Antenatal Care').click()
        confirmViewMode('Antenatal Care')

        // Open the dashboard app with the root url
        cy.visit('/', EXTENDED_TIMEOUT)

        cy.location().should((loc) => {
            expect(loc.hash).to.equal('#/')
        })

        cy.get(dashboardTitleSel).should('be.visible')

        // Open the "Delivery" dashboard
        getNavigationMenuItem('Delivery').click()
        confirmViewMode('Delivery')

        // Open the dashboard app with the root url
        cy.visit('/', EXTENDED_TIMEOUT)

        cy.location().should((loc) => {
            expect(loc.hash).to.equal('#/')
        })

        // Assert the "Delivery" dashboard displays (as it's the last viewed)
        cy.get(dashboardTitleSel)
            .should('be.visible')
            .and('contain', 'Delivery')
    })

    it('should view the print layout preview and then print one-item-per-page preview', () => {
        const title = 'Delivery'
        getNavigationMenuItem(title).click()

        confirmViewMode(title)

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
        confirmViewMode(title)

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
        confirmViewMode(title)
    })

    it.skip('shows layer names in legend for map with tracked entities', () => {
        // Given I open the Cases Malaria dashboard
        cy.visit(`/${dashboards['Cases Malaria'].route}`)
        confirmViewMode('Cases Malaria')
        // When I hover over the map legend button
        getDashboardItem(mapItemUid)
            .getIframeBody()
            .find('.dhis2-map-legend-button', EXTENDED_TIMEOUT)
            .trigger('mouseover')
        // Then the legend title shows the tracked entity name
        getDashboardItem(mapItemUid)
            .getIframeBody()
            .find('.dhis2-map-legend-title')
            .contains('Malaria case registration')
            .should('be.visible')
    })
})
