import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import { dashboards } from '../../../assets/backends/sierraLeone_236'
import {
    dashboardTitleSel,
    dashboardChipSel,
    dashboardSearchInputSel,
} from '../../../selectors/viewDashboard'

When('I select the Immunization dashboard', () => {
    cy.get(dashboardChipSel).contains('Immun').click()
})

When('I search for dashboards containing Immunization', () => {
    cy.get(dashboardSearchInputSel).type('Immun')
})

Then('Immunization and Immunization data dashboards are choices', () => {
    cy.get(dashboardChipSel).should('be.visible').and('have.length', 2)
})

When('I press enter in the search dashboard field', () => {
    cy.get(dashboardSearchInputSel).type('{enter}')
})

When('I search for dashboards containing Noexist', () => {
    cy.get(dashboardSearchInputSel).type('Noexist')
})
Then('no dashboards are choices', () => {
    cy.get(dashboardChipSel).should('not.exist')
})

Then('dashboards list restored and dashboard is still {string}', title => {
    cy.get(dashboardChipSel).should('be.visible').and('have.lengthOf.above', 0)

    cy.location().should(loc => {
        expect(loc.hash).to.equal(dashboards[title].route)
    })

    cy.get(dashboardTitleSel).should('be.visible').and('contain', title)
    cy.get('.highcharts-background').should('exist')
})
