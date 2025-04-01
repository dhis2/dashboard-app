import { dashboards } from '../assets/backends/sierraLeone_236.js'
import { clickMenuButton } from '../elements/dashboardItem.js'
import { dashboardTitleSel } from '../elements/viewDashboard.js'
import { getApiBaseUrl } from '../support/utils.js'

const dashboardTitle = 'Delivery'

describe('Item context menu', () => {
    it('should have the correct link for Open in app menu option', () => {
        cy.visit(`#/${dashboards[dashboardTitle].id}`)

        // ensure Delivery dashboard is displayed
        cy.location().should((loc) => {
            expect(loc.hash).to.equal(dashboards[dashboardTitle].route)
        })
        cy.get(dashboardTitleSel)
            .should('be.visible')
            .and('contain', dashboardTitle)

        // assert the link url for the Open in Data Visualizer app
        clickMenuButton(dashboards[dashboardTitle].items.chart.itemUid)

        const baseUrl = getApiBaseUrl()

        cy.contains('Open in Data Visualizer app')
            .should('have.attr', 'href')
            .and(
                'include',
                `${baseUrl}/dhis-web-data-visualizer/#/${dashboards[dashboardTitle].items.chart.visUid}`
            )
        // .and('include', '_blank')

        cy.contains('Open in Data Visualizer app')
            .should('have.attr', 'target')
            .and('include', '_blank')
    })
})
