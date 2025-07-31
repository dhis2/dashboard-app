import {
    clickEditActionButton,
    dashboardTitleSel,
    dashboardDescriptionSel,
    clickViewActionButton,
    newButtonSel,
    getNavigationMenuItem,
    confirmActionDialogSel,
} from '../elements/index.js'
import {
    getApiBaseUrl,
    EXTENDED_TIMEOUT,
    createDashboardTitle,
} from '../support/utils.js'

const deleteDashboard = (dashboardTitle) => {
    clickEditActionButton('Delete')

    cy.contains(
        `Deleting dashboard "${dashboardTitle}" will remove it for all users`
    ).should('be.visible')
    cy.get(confirmActionDialogSel).find('button').contains('Delete').click()
    cy.url().should('not.include', 'edit')

    // Confirm different dashboard is shown in view mode
    getNavigationMenuItem(dashboardTitle).should('not.exist')
    cy.get(dashboardTitleSel)
        .should('be.visible')
        .and('not.contain', dashboardTitle)
}

let norwegianTitle = ''
let norwegianDesc = ''

const addNorwegianTranslations = () => {
    const now = new Date().toUTCString()
    norwegianTitle = 'nor title ' + now
    norwegianDesc = 'nor desc ' + now

    clickEditActionButton('Translate')
    cy.contains('Select locale').click()
    cy.contains('Select locale').type('Norwegian{enter}')
    cy.get('[placeholder="Name"]').clear()
    cy.get('[placeholder="Name"]').type(norwegianTitle)
    cy.get('[placeholder="Description"]').clear()
    cy.get('[placeholder="Description"]').type(norwegianDesc)
    cy.get('button').contains('Save', EXTENDED_TIMEOUT).click()
}

const assertNorwegianTranslations = () => {
    // set dblocale to Norwegian
    cy.request(
        'POST',
        `${getApiBaseUrl()}/api/userSettings/keyDbLocale`,
        'no'
    ).then((response) => {
        expect(response.status).to.equal(200)
    })

    // reload the dashboard
    cy.visit('/')

    cy.get(dashboardTitleSel, EXTENDED_TIMEOUT)
        .should('be.visible')
        .and('contain', norwegianTitle)

    clickViewActionButton('More')
    cy.contains('Show description').click()

    cy.get(dashboardDescriptionSel)
        .should('be.visible')
        .and('contain', norwegianDesc)

    clickViewActionButton('More')
    cy.contains('Hide description').click()
}

it('adds translations to a dashboard and saves it', () => {
    // Create a dashboard
    cy.visit('/')
    const TEST_DASHBOARD_TITLE = createDashboardTitle('e2e-translate')
    cy.get(newButtonSel, EXTENDED_TIMEOUT).click()
    cy.get('[data-test="dashboard-title-input"]').type(TEST_DASHBOARD_TITLE)
    cy.get('[data-test="dashboard-description-input"]').type(
        TEST_DASHBOARD_TITLE + ' description'
    )

    // Save the dashboard first
    clickEditActionButton('Save changes')
    cy.get(dashboardTitleSel, EXTENDED_TIMEOUT)
        .should('be.visible')
        .and('contain', TEST_DASHBOARD_TITLE)

    // Edit the dashboard
    clickViewActionButton('Edit')

    // Add translations for dashboard name and description
    addNorwegianTranslations()

    // Save the dashboard
    clickEditActionButton('Save changes')
    cy.get(dashboardTitleSel, EXTENDED_TIMEOUT).should('be.visible')

    // Assert Norwegian title and description are displayed
    assertNorwegianTranslations()

    deleteDashboard(TEST_DASHBOARD_TITLE)
})

it('adds translations to a dashboard and discards dashboard changes', () => {
    // Create a dashboard
    cy.visit('/')
    const TEST_DASHBOARD_TITLE = createDashboardTitle('e2e-translate-discard')
    cy.get(newButtonSel, EXTENDED_TIMEOUT).click()
    cy.get('[data-test="dashboard-title-input"]').type(TEST_DASHBOARD_TITLE)
    cy.get('[data-test="dashboard-description-input"]').type(
        TEST_DASHBOARD_TITLE + ' description'
    )

    // Save the dashboard first
    clickEditActionButton('Save changes')
    cy.get(dashboardTitleSel, EXTENDED_TIMEOUT)
        .should('be.visible')
        .and('contain', TEST_DASHBOARD_TITLE)

    // Choose to edit dashboard
    clickViewActionButton('Edit')

    // Add translations for dashboard name and description
    addNorwegianTranslations()

    // Click Exit without saving
    clickEditActionButton('Exit without saving')
    cy.get(dashboardTitleSel, EXTENDED_TIMEOUT).should('be.visible')

    // Norwegian title and description are displayed (translations persist even when dashboard changes are discarded)
    assertNorwegianTranslations()

    // Delete the dashboard
    clickViewActionButton('Edit')
    deleteDashboard(TEST_DASHBOARD_TITLE)
})
