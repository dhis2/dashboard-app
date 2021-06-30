import { Given } from 'cypress-cucumber-preprocessor/steps'
import { dashboards } from '../../../assets/backends'
import { chartSel } from '../../../elements/dashboardItem'
import {
    dashboardTitleSel,
    dashboardChipSel,
} from '../../../elements/viewDashboard'
import { EXTENDED_TIMEOUT } from '../../../support/utils'

Given('I open the {string} dashboard', title => {
    cy.get(dashboardChipSel, EXTENDED_TIMEOUT).contains(title).click()

    cy.location().should(loc => {
        expect(loc.hash).to.equal(dashboards[title].route)
    })

    cy.get(dashboardTitleSel).should('be.visible').and('contain', title)
    cy.get(chartSel, EXTENDED_TIMEOUT).should('exist')
})
