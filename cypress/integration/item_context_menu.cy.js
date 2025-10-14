import { dashboards } from '../assets/backends/sierraLeone_236.js'
import {
    clickMenuButton,
    getDashboardItem,
    itemDetailsSel,
    itemMenuButtonSel,
    confirmViewMode,
    closeModal,
} from '../elements/index.js'
import { getApiBaseUrl } from '../support/utils.js'

describe('Item context menu', () => {
    it('should have the correct link for Open in app menu option', () => {
        cy.visit(`/${dashboards.Delivery.route}`)
        confirmViewMode('Delivery')

        // Ensure Delivery dashboard is displayed
        cy.location().should((loc) => {
            expect(loc.hash).to.equal(dashboards.Delivery.route)
        })

        // Assert the link url for the Open in Data Visualizer app
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

        closeModal()

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
        cy.visit(`/${dashboards.Delivery.route}`)
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
    })

    it('verifies text item does not have a context menu', () => {
        cy.visit(`/${dashboards['Antenatal Care'].route}`)
        confirmViewMode('Antenatal Care')

        // Assert the text item does not have a context menu
        getDashboardItem(dashboards['Antenatal Care'].items.text.itemUid)
            .find(itemMenuButtonSel)
            .should('not.exist')
    })

    it('verifies chart item has a fullscreen option', () => {
        cy.visit(`/${dashboards['Antenatal Care'].route}`)
        confirmViewMode('Antenatal Care')

        // Assert the chart item has a fullscreen option in the context menu
        clickMenuButton(dashboards['Antenatal Care'].items.chart.itemUid)
        cy.contains('View fullscreen').should('be.visible')

        closeModal()
    })
})
