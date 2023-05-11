import { dashboards } from '../assets/backends/sierraLeone_236.js'
import {
    getDashboardItem,
    gridItemSel,
    // mapSel,
} from '../elements/dashboardItem.js'
import {
    // showMoreLessSel,
    dashboardTitleSel,
    dashboardChipSel,
    dashboardSearchInputSel,
} from '../elements/viewDashboard.js'
import { exitPrintLayout } from '../helpers/exit_print_layout.js'
import { openPrintLayout } from '../helpers/open_print_layout.js'
import { openSLDashboard } from '../helpers/open_the_SL_dashboard.js'
import { openPrintOipp, printOippIsDisplayed } from '../helpers/print.js'
import { printLayoutIsDisplayed } from '../helpers/print_layout_displays.js'
import { expectSLDashboardToDisplayInViewMode } from '../helpers/SL_dashboard_displays_in_view_mode.js'
import { EXTENDED_TIMEOUT } from '../support/utils.js'

// const toggleShowMoreDashboards = () => cy.get(showMoreLessSel).click()

const openDashboardRootUrl = () => {
    cy.visit('/', EXTENDED_TIMEOUT)

    cy.location().should((loc) => {
        expect(loc.hash).to.equal('#/')
    })

    cy.get(dashboardTitleSel).should('be.visible')
    cy.get(dashboardChipSel, EXTENDED_TIMEOUT).should('be.visible')
}

const searchForDashboard = (searchText) =>
    cy.get(dashboardSearchInputSel).type(searchText)

describe('View dashboard', () => {
    it('switches between dashboards', () => {
        cy.visit('/', EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))
        openSLDashboard('Delivery')
        openSLDashboard('Immunization')
    })

    it('searches for a dashboard', () => {
        cy.visit('/', EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))
        openSLDashboard('Antenatal Care')
        searchForDashboard('Immun')
        // Immunization and Immunization data dashboards are choices
        cy.get(dashboardChipSel).should('be.visible').and('have.length', 2)
        cy.get(dashboardSearchInputSel).type('{enter}')
        expectSLDashboardToDisplayInViewMode('Immunization')
    })

    it('searches for a dashboard with nonmatching search text', () => {
        cy.visit('/', EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))
        const title = 'Antenatal Care'
        openSLDashboard(title)
        searchForDashboard('Noexist')
        cy.get(dashboardChipSel).should('not.exist')
        cy.get(dashboardSearchInputSel).type('{enter}')

        // Then dashboards list restored and dashboard is still "Antenatal Care"
        cy.get(dashboardChipSel)
            .should('be.visible')
            .and('have.lengthOf.above', 0)

        cy.location().should((loc) => {
            expect(loc.hash).to.equal(dashboards[title].route)
        })

        cy.get(dashboardTitleSel).should('be.visible').and('contain', title)

        // FIXME
        // cy.get(`${gridItemSel}.VISUALIZATION`)
        //     .first()
        //     .getIframeBody()
        //     .find('.highcharts-background')
        //     .should('exist')
    })

    it('views the print layout preview', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openSLDashboard('Delivery')
        openPrintLayout()
        printLayoutIsDisplayed('Delivery')
        exitPrintLayout()
        expectSLDashboardToDisplayInViewMode('Delivery')
    })

    it('views the print one-item-per-page preview', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openSLDashboard('Delivery')
        openPrintOipp()
        printOippIsDisplayed('Delivery')
        exitPrintLayout()
        expectSLDashboardToDisplayInViewMode('Delivery')
    })

    it('views a dashboard with items lacking shape', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
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
        cy.get(dashboardChipSel, EXTENDED_TIMEOUT).contains(title).click()

        expectSLDashboardToDisplayInViewMode('Delivery')
    })

    it('shows layer names in legend', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openSLDashboard('Cases Malaria')

        // hover over the map legend button
        const mapItemUid = dashboards['Cases Malaria'].items.map.itemUid
        getDashboardItem(mapItemUid)
            .getIframeBody()
            .find('.dhis2-map-legend-button', EXTENDED_TIMEOUT)
            .trigger('mouseover')

        // the legend title shows the tracked entity name
        getDashboardItem(mapItemUid)
            .getIframeBody()
            .find('.dhis2-map-legend-title')
            .contains('Malaria case registration')
            .should('be.visible')
    })

    it("opens the user's preferred dashboard", () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openSLDashboard('Antenatal Care')
        openDashboardRootUrl()
        openSLDashboard('Delivery')
        openDashboardRootUrl()
    })

    // FIXME: flaky test
    it.skip('changes the height of the control bar', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openSLDashboard('Delivery')
        // When I drag to increase the height of the control bar
        // Then the control bar height should be updated
    })

    // FIXME: flaky test
    it.skip('changes the height of an expanded control bar', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openSLDashboard('Delivery')
        // When I toggle show more dashboards
        // And I drag to decrease the height of the control bar
        // Then the control bar height should be updated
    })
})
