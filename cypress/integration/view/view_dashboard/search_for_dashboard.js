import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import { dashboards } from '../../../assets/backends/sierraLeone_236'
import {
    dashboardTitleSel,
    dashboardChipSel,
    dashboardSearchInputSel,
} from '../../../elements/viewDashboard'

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
    cy.get('.highcharts-background').should('exist')
})
