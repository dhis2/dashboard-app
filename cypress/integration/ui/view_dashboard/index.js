import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

const antenatalCareDashboardRoute = '#/nghVC4wtyzi'
const immunizationDashboardRoute = '#/TAMlzYkstb7'

Given('I open the Antenatal Care dashboard', () => {
    cy.visit('/', {
        timeout: 15000,
    })
    cy.get('[data-test="dhis2-uicore-chip"]', {
        timeout: 15000,
    })
        .contains('Antenatal Care')
        .click()
})

Then('the Antenatal Care dashboard displays in view mode', () => {
    cy.location().should(loc => {
        expect(loc.hash).to.equal(antenatalCareDashboardRoute)
    })

    cy.get('[data-test="view-dashboard-title"]')
        .should('be.visible')
        .and('contain', 'Antenatal Care')
    cy.get('.highcharts-background').should('exist')
})

When('I select the Immunization dashboard', () => {
    cy.get('[data-test="dhis2-uicore-chip"]').contains('Immun').click()
})

Then('the Immunization dashboard displays in view mode', () => {
    cy.location().should(loc => {
        expect(loc.hash).to.equal(immunizationDashboardRoute)
    })

    cy.get('[data-test="view-dashboard-title"]')
        .should('be.visible')
        .and('contain', 'Immunization')
    cy.get('.highcharts-background').should('exist')
})

When('I search for dashboards containing Immunization', () => {
    cy.get('[data-test="search-dashboard-input"]').type('Immun')
})

Then('Immunization and Immunization data dashboards are choices', () => {
    cy.get('[data-test="dhis2-uicore-chip"]')
        .should('be.visible')
        .and('have.length', 2)
})

When('I press enter in the search dashboard field', () => {
    cy.get('[data-test="search-dashboard-input"]').type('{enter}')
})

When('I click to preview the print layout', () => {
    cy.get('[data-test="more-button"]').click()
    cy.get('[data-test="print-menu-item"]').click()
    cy.get('[data-test="print-layout-menu-item"]').click()
})

Then('the print layout displays', () => {
    //check the url
    cy.location().should(loc => {
        expect(loc.hash).to.equal(`${antenatalCareDashboardRoute}/printlayout`)
    })

    //check for some elements
    cy.get('[data-test="print-layout-page"]').should('be.visible')
})

When('I click to exit print preview', () => {
    cy.get('[data-test="exit-print-preview"]').click()
})

When('I click to preview the print one-item-per-page', () => {
    cy.get('[data-test="more-button"]').click()
    cy.get('[data-test="print-menu-item"]').click()
    cy.get('[data-test="print-oipp-menu-item"]').click()
})

Then('the print one-item-per-page displays', () => {
    //check the url
    cy.location().should(loc => {
        expect(loc.hash).to.equal(`${antenatalCareDashboardRoute}/printoipp`)
    })

    //check for some elements
    cy.get('[data-test="print-oipp-page"]').should('be.visible')
})

When('I search for dashboards containing Noexist', () => {
    cy.get('[data-test="search-dashboard-input"]').type('Noexist')
})
Then('no dashboards are choices', () => {
    cy.get('[data-test="dhis2-uicore-chip"]').should('not.be.visible')
})

Then("dashboards list restored and dashboard doesn't change", () => {
    cy.get('[data-test="dhis2-uicore-chip"]')
        .should('be.visible')
        .and('have.lengthOf.above', 0)

    cy.location().should(loc => {
        expect(loc.hash).to.equal(antenatalCareDashboardRoute)
    })

    cy.get('[data-test="view-dashboard-title"]')
        .should('be.visible')
        .and('contain', 'Antenatal Care')
    cy.get('.highcharts-background').should('exist')
})
