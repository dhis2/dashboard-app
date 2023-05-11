import { dashboards } from '../assets/backends/index.js'
// import { gridItemSel, chartSel } from '../elements/dashboardItem.js'
import { dashboardTitleSel } from '../elements/viewDashboard.js'
// import { EXTENDED_TIMEOUT } from '../support/utils.js'

export const expectSLDashboardToDisplayInViewMode = (title) => {
    cy.location().should((loc) => {
        expect(loc.hash).to.equal(dashboards[title].route)
    })

    cy.get(dashboardTitleSel).should('be.visible').and('contain', title)

    // cy.get(gridItemSel)
    //     .first()
    //     .getIframeBody()
    //     .find(chartSel, EXTENDED_TIMEOUT)
    //     .should('exist')
}
