import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

const antenatalCareDashboardRoute = '#/nghVC4wtyzi'
const immunizationDashboardRoute = '#/TAMlzYkstb7'

Given('I open the Antenatal Care dashboard', () => {
    cy.visit(antenatalCareDashboardRoute)
})

Then('the Antenatal Care dashboard displays in view mode', () => {
    cy.location().should(loc => {
        expect(loc.hash).to.equal(antenatalCareDashboardRoute)
    })

    cy.get('[data-test="dhis2-dashboard-view-dashboard-title"]').should(
        'contain',
        'Antenatal Care'
    )
    cy.get('.highcharts-background').should('exist')
})

When('I select the Immunization dashboard', () => {
    cy.get('[data-test="dhis2-uicore-chip"]')
        .contains('Immunization')
        .click()
})

Then('the Immunization dashboard displays in view mode', () => {
    cy.location().should(loc => {
        expect(loc.hash).to.equal(immunizationDashboardRoute)
    })

    cy.get('[data-test="dhis2-dashboard-view-dashboard-title"]').should(
        'contain',
        'Immunization'
    )
    cy.get('.highcharts-background').should('exist')
})

When('I search for dashboards containing Immunization', () => {
    cy.get('[data-test="dhis2-dashboard-search-dashboard-input"]').type('Immun')
})

Then('Immunization and Immunization data dashboards are choices', () => {
    cy.get('[data-test="dhis2-uicore-chip"]').should('have.length', 2)
})

When('I press enter in the search dashboard field', () => {
    cy.get('[data-test="dhis2-dashboard-search-dashboard-input"]').type(
        '{enter}'
    )
})
