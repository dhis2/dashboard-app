import { When, Then } from '@badeball/cypress-cucumber-preprocessor'
import { dashboards } from '../../../assets/backends/sierraLeone_236.js'
import { gridItemSel } from '../../../elements/dashboardItem.js'
import {
    dashboardTitleSel,
    dashboardChipSel,
    dashboardSearchInputSel,
} from '../../../elements/viewDashboard.js'

When('I search for dashboards containing {string}', (title) => {
    cy.get(dashboardSearchInputSel).type(title)
})

Then('Immunization and Immunization data dashboards are choices', () => {
    cy.get(dashboardChipSel).should('be.visible').and('have.length', 2)
})

When('I press enter in the search dashboard field', () => {
    cy.get(dashboardSearchInputSel).type('{enter}')
})

Then('no dashboards are choices', () => {
    cy.get(dashboardChipSel).should('not.exist')
})

Then('dashboards list restored and dashboard is still {string}', (title) => {
    cy.get(dashboardChipSel).should('be.visible').and('have.lengthOf.above', 0)

    cy.location().should((loc) => {
        expect(loc.hash).to.equal(dashboards[title].route)
    })

    cy.get(dashboardTitleSel).should('be.visible').and('contain', title)

    cy.get(`${gridItemSel}.VISUALIZATION`)
        .first()
        .getIframeBody()
        .find('.highcharts-background')
        .should('exist')
})
