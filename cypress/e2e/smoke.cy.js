import { dashboards } from '../assets/backends/index.js'
import {
    getNavigationMenuItem,
    dashboardTitleSel,
    newButtonSel,
    addDashboardItem,
    clickEditActionButton,
    confirmViewMode,
} from '../elements/index.js'
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

// Smoke tests - check that dashboard app and dashboard loads

it('Opens the dashboard app', () => {
    cy.visit('/')
    cy.get(dashboardTitleSel).should('be.visible')
    cy.getByDataTest('headerbar-title')
        .contains('DHIS 2 Demo - Sierra Leone - Dashboard')
        .should('be.visible')
})

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

it.skip('Adds a custom widget to a dashboard', () => {
    const customApp = {
        name: 'Users-Role-Monitor-Widget',
        id: '5e43908a-3105-4baa-9a00-87a94ebdc034',
    }
    // First install a custom app
    cy.request('POST', `${getApiBaseUrl()}/api/appHub/${customApp.id}`).then(
        (response) => {
            expect(response.status).to.be.oneOf([204, 201])

            // Start a new dashboard
            cy.visit('/')
            cy.get(newButtonSel).click()
            // add the dashboard title
            cy.getByDataTest('dashboard-title-input').type('Custom App Test')
            // add dashboard items
            addDashboardItem('Role Monitor Widget')

            // save
            clickEditActionButton('Save changes')

            confirmViewMode('Custom App Test')

            // Assert the custom app is visible by checking for the item's title
            // check that the custom app is loaded (see ticket DHIS2-14544)
            cy.get('iframe')
                .invoke('attr', 'title')
                .contains('Role Monitor Widget')
                .scrollIntoView()
            cy.get('iframe')
                .invoke('attr', 'title')
                .contains('Role Monitor Widget')
                .should('be.visible')

            // remove the custom app
            cy.request(
                'DELETE',
                `${getApiBaseUrl()}/api/apps/${customApp.name}`
            ).then((response) => {
                expect(response.status).to.equal(204)
            })
        }
    )
})
