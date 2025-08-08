import { dashboards } from '../assets/backends/index.js'
import { getNavigationMenuItem, dashboardTitleSel } from '../elements/index.js'

// Smoke tests - check that dashboard app and dashboard loads

it('opens the dashboard app', () => {
    cy.visit('/')
    cy.get(dashboardTitleSel).should('be.visible')
    cy.getByDataTest('headerbar-title')
        .contains('DHIS 2 Demo - Sierra Leone - Dashboard')
        .should('be.visible')
})

it('opens a dashboard in the app', () => {
    cy.visit('/')
    getNavigationMenuItem(dashboards.Delivery.title).click()
    cy.get(dashboardTitleSel)
        .contains(dashboards.Delivery.title)
        .should('be.visible')
    cy.getByDataTest('headerbar-title')
        .contains('DHIS 2 Demo - Sierra Leone - Dashboard')
        .should('be.visible')
})

// i.e, new installation with no dashboards
it('informs that there are no dashboards', () => {
    cy.intercept(/\/dashboards\?/, {
        body: {
            dashboards: [],
        },
    })

    cy.visit('/')
    cy.contains('No dashboards found').should('be.visible')
    cy.getByDataTest('new-button').should('be.visible')
})
