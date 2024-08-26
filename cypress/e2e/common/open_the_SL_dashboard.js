import { Given } from '@badeball/cypress-cucumber-preprocessor'
import { dashboards } from '../../assets/backends/index.js'
// import { gridItemSel, chartSel } from '../../elements/dashboardItem.js'
import {
    dashboardTitleSel,
    dashboardChipSel,
} from '../../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT } from '../../support/utils.js'

Given('I open the {string} dashboard', (title) => {
    cy.get(dashboardChipSel, EXTENDED_TIMEOUT).contains(title).click()

    cy.location().should((loc) => {
        expect(loc.hash).to.equal(dashboards[title].route)
    })

    cy.get(dashboardTitleSel).should('be.visible').and('contain', title)
    // cy.get(`${gridItemSel}.VISUALIZATION`)
    //     .first()
    //     .getIframeBody()
    //     .find(chartSel, EXTENDED_TIMEOUT)
    //     .as('vis')
    // cy.get('@vis').should('exist')
})
