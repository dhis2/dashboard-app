import { dashboards } from '../assets/backends/sierraLeone_236.js'
import {
    clickMenuButton,
    getDashboardItem,
    itemDetailsSel,
    itemMenuButtonSel,
    getNavigationMenuItem,
    confirmViewMode,
} from '../elements/index.js'
import { getApiBaseUrl } from '../support/utils.js'

describe('Item context menu', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('should have the correct link for Open in app menu option', () => {
        getNavigationMenuItem('Delivery').click()
        confirmViewMode('Delivery')

        // ensure Delivery dashboard is displayed
        cy.location().should((loc) => {
            expect(loc.hash).to.equal(dashboards.Delivery.route)
        })

        // assert the link url for the Open in Data Visualizer app
        clickMenuButton(dashboards.Delivery.items.chart.itemUid)

        cy.contains('Open in Data Visualizer app')
            .should('have.attr', 'href')
            .and(
                'include',
                `${getApiBaseUrl()}/dhis-web-data-visualizer/#/${
                    dashboards.Delivery.items.chart.visUid
                }`
            )

        cy.contains('Open in Data Visualizer app')
            .should('have.attr', 'target')
            .and('include', '_blank')

        /**
         * Since Cypress cannot work with multiple tabs and more
         * than one domain in a single test, modify the link to:
         *  1) open in the current Cypress tab instead of new tab
         *  2) open on the test domain instead of the api domain
         */
        // cy.contains('Open in Data Visualizer app')
        //     .invoke('removeAttr', 'target')
        //     .invoke(
        //         'attr',
        //         'href',
        //         `${Cypress.config().baseUrl}/${chartItemVisUrl}`
        //     )
        //     .click()

        // cy.url().should('include', chartItemVisUrl)
    })

    it('opens the interpretations panel', () => {
        // Open the "Delivery" dashboard
        getNavigationMenuItem('Delivery').click()
        confirmViewMode('Delivery')

        // Click Show details and interpretations on a chart dashboard item
        const chartItemUid = dashboards.Delivery.items.chart.itemUid
        clickMenuButton(chartItemUid)
        cy.contains('Show details and interpretations').click()

        // Assert the interpretations panel is displayed
        getDashboardItem(chartItemUid)
            .find(itemDetailsSel)
            .contains('About this')
            .scrollIntoView()
            .should('be.visible')

        getDashboardItem(chartItemUid)
            .find(itemDetailsSel)
            .contains('Interpretations')
            .scrollIntoView()
            .should('be.visible')

        // TODO - more checks in About and Interpretations sections
    })

    it('verifies text item does not have a context menu', () => {
        // Open the "Antenatal Care" dashboard
        getNavigationMenuItem('Antenatal Care').click()
        confirmViewMode('Antenatal Care')

        // Assert the text item does not have a context menu
        getDashboardItem(dashboards['Antenatal Care'].items.text.itemUid)
            .find(itemMenuButtonSel)
            .should('not.exist')
    })

    it('verifies chart item has a fullscreen option', () => {
        // Open the "Antenatal Care" dashboard
        getNavigationMenuItem('Antenatal Care').click()
        confirmViewMode('Antenatal Care')

        // Assert the chart item has a fullscreen option in the context menu
        clickMenuButton(dashboards['Antenatal Care'].items.chart.itemUid)
        cy.contains('View fullscreen').should('be.visible')
    })

    // Scenario: View chart as table
    //     Given I open the "Delivery" dashboard
    //     And the chart dashboard item displays as a chart
    //     And the table dashboard item displays as a table
    //     When I click View As Table on a chart dashboard item
    //     Then the chart dashboard item displays as a table

    //  Scenario: View chart as map
    //     Given I open the "Delivery" dashboard
    //     And the chart dashboard item displays as a chart
    //     And the table dashboard item displays as a table
    //     When I click View As Map on a chart dashboard item
    //     Then the chart dashboard item displays as a map

    //  Scenario: View table as chart
    //     Given I open the "Delivery" dashboard
    //     And the chart dashboard item displays as a chart
    //     And the table dashboard item displays as a table
    //     When I click View As Chart on a table dashboard item
    //     Then the table dashboard item displays as a chart
})
