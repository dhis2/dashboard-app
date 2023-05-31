import { dashboards } from '../assets/backends/sierraLeone_236.js'
import {
    getDashboardItem,
    mapLegendButtonClass,
    mapLegendTitleClass,
    gridItemClass,
    // mapClass,
} from '../elements/dashboardItem.js'
import {
    dashboardTitleSel,
    dashboardChipSel,
    dashboardSearchInputSel,
} from '../elements/viewDashboard.js'
import {
    openDashboard,
    expectDashboardToDisplayInViewMode,
} from '../helpers/edit_dashboard.js'
import {
    exitPrintMode,
    openPrintLayout,
    openPrintOipp,
    printOippIsDisplayed,
    printLayoutIsDisplayed,
} from '../helpers/print.js'
import {
    resizeDashboardsBarDown,
    resizeDashboardsBarUp,
    expectDashboardsBarHeightToBeUpdated,
} from '../helpers/resize_dashboards_bar.js'
import { EXTENDED_TIMEOUT } from '../support/utils.js'

// const toggleShowMoreDashboards = () => cy.get(showMoreLessSel).click()

const DELIVERY_DASHBOARD_TITLE = 'Delivery'

const openDashboardRootUrl = () => {
    cy.visit('/', EXTENDED_TIMEOUT)

    cy.location(EXTENDED_TIMEOUT).should((loc) => {
        // cy.log('loc', loc.toString()) // FIXME
        expect(loc.hash).to.equal('#/')
    })

    cy.getBySel(dashboardTitleSel).should('be.visible')
    cy.getBySel(dashboardChipSel, EXTENDED_TIMEOUT).should('be.visible')
}

const searchForDashboard = (searchText) =>
    cy.get(dashboardSearchInputSel).type(searchText)

describe('View dashboard', () => {
    it('switches between dashboards', () => {
        cy.visit('/', EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))
        openDashboard(DELIVERY_DASHBOARD_TITLE)
        openDashboard('Immunization')
    })

    it('searches for a dashboard', () => {
        cy.visit('/', EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))
        openDashboard(DELIVERY_DASHBOARD_TITLE)
        searchForDashboard('Immun')
        // Immunization and Immunization data dashboards are choices
        cy.getBySel(dashboardChipSel).should('be.visible').and('have.length', 2)
        cy.get(dashboardSearchInputSel).type('{enter}')
        expectDashboardToDisplayInViewMode('Immunization')
    })

    it('searches for a dashboard with nonmatching search text', () => {
        cy.visit('/', EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))
        const title = DELIVERY_DASHBOARD_TITLE
        openDashboard(title)
        searchForDashboard('Noexist')
        cy.getBySel(dashboardChipSel).should('not.exist')
        cy.get(dashboardSearchInputSel).type('{enter}')

        // Then dashboards list restored and dashboard is still "Antenatal Care"
        cy.getBySel(dashboardChipSel)
            .should('be.visible')
            .and('have.lengthOf.above', 0)

        cy.location().should((loc) => {
            expect(loc.hash).to.equal(dashboards[title].route)
        })

        cy.getBySel(dashboardTitleSel)
            .should('be.visible')
            .and('contain', title)

        cy.get(`${gridItemClass}.VISUALIZATION`)
            .first()
            .getIframeBody()
            .as('iframebody')

        cy.get('@iframebody')
            .find('.highcharts-background')
            .as('chartBackground')

        cy.get('@chartBackground').should('exist')
    })

    it('views the print layout preview', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard(DELIVERY_DASHBOARD_TITLE)
        openPrintLayout()
        printLayoutIsDisplayed(DELIVERY_DASHBOARD_TITLE)
        exitPrintMode()
        expectDashboardToDisplayInViewMode(DELIVERY_DASHBOARD_TITLE)
    })

    it('views the print one-item-per-page preview', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard(DELIVERY_DASHBOARD_TITLE)
        openPrintOipp()
        printOippIsDisplayed(DELIVERY_DASHBOARD_TITLE)
        exitPrintMode()
        expectDashboardToDisplayInViewMode(DELIVERY_DASHBOARD_TITLE)
    })

    it('views a dashboard with items lacking shape', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        const title = DELIVERY_DASHBOARD_TITLE
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
        cy.getBySel(dashboardChipSel, EXTENDED_TIMEOUT).contains(title).click()

        expectDashboardToDisplayInViewMode(DELIVERY_DASHBOARD_TITLE)
    })

    it('shows layer names in legend', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard(DELIVERY_DASHBOARD_TITLE)

        // hover over the map legend button
        const mapItemUid =
            dashboards[DELIVERY_DASHBOARD_TITLE].items.map.itemUid
        getDashboardItem(mapItemUid)
            .getIframeBody()
            .find(mapLegendButtonClass, EXTENDED_TIMEOUT)
            .as('legendButton')

        cy.get('@legendButton').trigger('mouseover')

        // the legend title shows the tracked entity name
        getDashboardItem(mapItemUid)
            .getIframeBody()
            .find(mapLegendTitleClass)
            .as('legendTitle')

        cy.get('@legendTitle')
            .contains('PHU delivery rate')
            .should('be.visible')
    })

    it("opens the user's preferred dashboard", () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard('Antenatal Care', [])
        openDashboardRootUrl()
        openDashboard(DELIVERY_DASHBOARD_TITLE)
        openDashboardRootUrl()
    })

    // FIXME: flaky test
    it.skip('changes the height of the control bar', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard(DELIVERY_DASHBOARD_TITLE)
        resizeDashboardsBarUp()
        expectDashboardsBarHeightToBeUpdated()
    })

    // FIXME: flaky test
    it.skip('changes the height of an expanded control bar', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard(DELIVERY_DASHBOARD_TITLE)
        // When I toggle show more dashboards
        resizeDashboardsBarDown()
        expectDashboardsBarHeightToBeUpdated()
    })
})
