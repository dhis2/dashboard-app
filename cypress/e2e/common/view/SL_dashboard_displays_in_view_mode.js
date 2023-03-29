import { Then } from '@badeball/cypress-cucumber-preprocessor'
import { dashboards } from '../../../assets/backends/index.js'
import { chartSel } from '../../../elements/dashboardItem.js'
import { dashboardTitleSel } from '../../../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT } from '../../../support/utils.js'

Then('the {string} dashboard displays in view mode', (title) => {
    cy.location().should((loc) => {
        expect(loc.hash).to.equal(dashboards[title].route)
    })

    cy.get(dashboardTitleSel).should('be.visible').and('contain', title)
    cy.get(chartSel, EXTENDED_TIMEOUT).should('exist')
})
