import { dashboards } from '../assets/backends/index.js'
import { getNavigationMenuItem } from '../elements/navigationMenu.js'
import { dashboardTitleSel } from '../elements/viewDashboard.js'
import { getApiBaseUrl } from '../support/utils.js'

// TODO - needed?
beforeEach(() => {
    // set dblocale to English
    cy.request(
        'POST',
        `${getApiBaseUrl()}/api/userSettings/keyDbLocale`,
        'en'
    ).then((response) => {
        expect(response.status).to.equal(200)
    })
})

// Smoke test - check that dashboard app and dashboard loads

// Scenario: I open the dashboard app
//     Given I open the dashboard app
//     Dashboard title and headerbar title are displayed
it('Opens the dashboard app', () => {
    cy.visit('/')
    cy.get(dashboardTitleSel).should('be.visible')
    cy.getByDataTest('headerbar-title')
        .contains('DHIS 2 Demo - Sierra Leone - Dashboard')
        .should('be.visible')
})

// Scenario: I open a specific dashboard
//     Given I open the "Delivery" dashboard
//     Then the "Delivery" dashboard displays in view mode
it('Opens a dashboard in the app', () => {
    cy.visit('/')
    getNavigationMenuItem(dashboards.Delivery.title).click()
    cy.get(dashboardTitleSel)
        .contains(dashboards.Delivery.title)
        .should('be.visible')
    cy.getByDataTest('headerbar-title')
        .contains('DHIS 2 Demo - Sierra Leone - Dashboard')
        .should('be.visible')
})

// Scenario: New installation with no dashboards
//     Given I open the dashboard app with no dashboards
//     Then the "No dashboards found" message is displayed
//     And the "New" button is displayed
it('Informs that there are no dashboards', () => {
    cy.intercept(/\/dashboards\?/, {
        body: {
            dashboards: [],
        },
    })

    cy.visit('/')
    cy.contains('No dashboards found').should('be.visible')
    cy.getByDataTest('new-button').should('be.visible')
})
