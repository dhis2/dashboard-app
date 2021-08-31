import { Then } from 'cypress-cucumber-preprocessor/steps'
import { dashboards } from '../../../assets/backends'
import { chartSel } from '../../../elements/dashboardItem'
import { dashboardTitleSel } from '../../../elements/viewDashboard'
import { EXTENDED_TIMEOUT } from '../../../support/utils'

Then('the {string} dashboard displays in view mode', title => {
    cy.location().should(loc => {
        expect(loc.hash).to.equal(dashboards[title].route)
    })

    cy.get(dashboardTitleSel).should('be.visible').and('contain', title)
    cy.get(chartSel, EXTENDED_TIMEOUT).should('exist')
})
