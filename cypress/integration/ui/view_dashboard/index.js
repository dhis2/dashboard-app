import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

// const antenatalCareDashboardRoute = '#/nghVC4wtyzi'
const immunizationDashboardRoute = '#/TAMlzYkstb7'
const deliveryDashboardRoute = '#/iMnYyBfSxmM'

const DASHBOARD_ITEM_CHART_UID = 'GaVhJpqABYX'
const DASHBOARD_ITEM_TABLE_UID = 'qXsjttMYuoZ'
// const DASHBOARD_ITEM_MAP_UID = 'G3EtzSWNP9o'

beforeEach(() => {
    cy.visit('/')
})

Given('I open the Antenatal Care dashboard', () => {
    cy.get('[data-test="dhis2-uicore-chip"]')
        .contains('Antenatal Care')
        .click()
})

Given('I open the Delivery dashboard', () => {
    cy.get('[data-test="dhis2-uicore-chip"]')
        .contains('Delivery')
        .click()
})

When('I select the Immunization dashboard', () => {
    cy.get('[data-test="dhis2-uicore-chip"]')
        .contains('Immun')
        .click()
})

Then('the Immunization dashboard displays in view mode', () => {
    cy.location().should(loc => {
        expect(loc.hash).to.equal(immunizationDashboardRoute)
    })

    cy.get('[data-test="dhis2-dashboard-view-dashboard-title"]')
        .should('be.visible')
        .and('contain', 'Immunization')
    cy.get('.highcharts-background').should('exist')
})

When('I search for dashboards containing Immun', () => {
    cy.get('[data-test="dhis2-dashboard-search-dashboard-input"]').type('Immun')
})

Then('Immunization and Immunization data dashboards are choices', () => {
    cy.get('[data-test="dhis2-uicore-chip"]')
        .should('be.visible')
        .and('have.length', 2)
})

When('I press enter in the search dashboard field', () => {
    cy.get('[data-test="dhis2-dashboard-search-dashboard-input"]').type(
        '{enter}'
    )
})

When('I click to preview the print layout', () => {
    cy.get('[data-test="dhis2-dashboard-more-button"]').click()
    cy.get('[data-test="dhis2-dashboard-print-menu-item"]').click()
    cy.get('[data-test="dhis2-dashboard-print-layout-menu-item"]').click()
})

Then('the print layout displays', () => {
    //check the url
    cy.location().should(loc => {
        expect(loc.hash).to.equal(`${deliveryDashboardRoute}/printlayout`)
    })

    //check for some elements
    cy.get('[data-test="dhis2-dashboard-print-layout-page"]').should(
        'be.visible'
    )
})

When('I click to exit print preview', () => {
    cy.get('[data-test="dhis2-dashboard-exit-print-preview"]').click()
})

When('I click to preview the print one-item-per-page', () => {
    cy.get('[data-test="dhis2-dashboard-more-button"]').click()
    cy.get('[data-test="dhis2-dashboard-print-menu-item"]').click()
    cy.get('[data-test="dhis2-dashboard-print-oipp-menu-item"]').click()
})

Then('the print one-item-per-page displays', () => {
    //check the url
    cy.location().should(loc => {
        expect(loc.hash).to.equal(`${deliveryDashboardRoute}/printoipp`)
    })

    //check for some elements
    cy.get('[data-test="dhis2-dashboard-print-oipp-page"]').should('be.visible')
})

When('I click View As Table on a chart dashboard item', () => {
    cy.get(
        `[data-test="dhis2-dashboard-dashboard-item-prog-${DASHBOARD_ITEM_CHART_UID}"]`
    )
        .find('[data-test="dhis2-dashboard-item-context-menu"]')
        .click()

    cy.get('[data-test="dhis2-dashboard-item-viewas-table"]').click()
})

When('I click View As Chart on a table dashboard item', () => {
    cy.get(
        `[data-test="dhis2-dashboard-dashboard-item-prog-${DASHBOARD_ITEM_TABLE_UID}"]`
    )
        .find('[data-test="dhis2-dashboard-item-context-menu"]')
        .click()

    cy.get('[data-test="dhis2-dashboard-item-viewas-chart"]').click()
})

Then('the chart dashboard item displays as a chart', () => {
    cy.get(
        `[data-test="dhis2-dashboard-dashboard-item-prog-${DASHBOARD_ITEM_CHART_UID}"]`
    )
        .find('.highcharts-container')
        .should('be.visible')

    cy.get(
        `[data-test="dhis2-dashboard-dashboard-item-prog-${DASHBOARD_ITEM_CHART_UID}"]`
    )
        .find('.pivot-table-container')
        .should('not.be.visible')
})

Then('the chart dashboard item displays as a table', () => {
    cy.get(
        `[data-test="dhis2-dashboard-dashboard-item-prog-${DASHBOARD_ITEM_CHART_UID}"]`
    )
        .find('.highcharts-container')
        .should('not.exist')

    cy.get(
        `[data-test="dhis2-dashboard-dashboard-item-prog-${DASHBOARD_ITEM_CHART_UID}"]`
    )
        .find('.pivot-table-container')
        .should('be.visible')
})

Then('the table dashboard item displays as a chart', () => {
    cy.get(
        `[data-test="dhis2-dashboard-dashboard-item-prog-${DASHBOARD_ITEM_TABLE_UID}"]`
    )
        .find('.highcharts-container')
        .should('be.visible')

    cy.get(
        `[data-test="dhis2-dashboard-dashboard-item-prog-${DASHBOARD_ITEM_TABLE_UID}"]`
    )
        .find('.pivot-table-container')
        .should('not.exist')
})

Then('the table dashboard item displays as a table', () => {
    cy.get(
        `[data-test="dhis2-dashboard-dashboard-item-prog-${DASHBOARD_ITEM_TABLE_UID}"]`
    )
        .find('.highcharts-container')
        .should('not.exist')

    cy.get(
        `[data-test="dhis2-dashboard-dashboard-item-prog-${DASHBOARD_ITEM_TABLE_UID}"]`
    )
        .find('.pivot-table-container')
        .should('be.visible')
})

Then('the Delivery dashboard displays in view mode', () => {
    cy.location().should(loc => {
        expect(loc.hash).to.equal(deliveryDashboardRoute)
    })

    cy.get('[data-test="dhis2-dashboard-view-dashboard-title"]')
        .scrollIntoView()
        .should('be.visible')
        .and('contain', 'Delivery')
    cy.get('.highcharts-background').should('exist')
})
