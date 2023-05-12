import {
    clickEditActionButton,
    confirmActionDialogSel,
} from '../elements/editDashboard.js'
import {
    openDashboard,
    startNewDashboard,
    chooseToEditDashboard,
    addDashboardTitle,
    addDashboardItems,
    saveDashboard,
    expectDashboardToDisplayInViewMode,
    expectDashboardDisplaysInEditMode,
} from '../helpers/edit_dashboard.js'
import { EXTENDED_TIMEOUT, createDashboardTitle } from '../support/utils.js'

const TEST_DASHBOARD_TITLE = createDashboardTitle('af')

describe('Edit errors', () => {
    it("An error occurs while saving a dashboard that I don't have access to", () => {
        cy.visit('/', EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))
        startNewDashboard()
        addDashboardTitle(TEST_DASHBOARD_TITLE)
        addDashboardItems()
        saveDashboard()
        expectDashboardToDisplayInViewMode(TEST_DASHBOARD_TITLE)

        openDashboard(TEST_DASHBOARD_TITLE)
        chooseToEditDashboard()

        // I save dashboard that I don't have access to save
        cy.intercept('PUT', '**/dashboards/*', { statusCode: 409 })
        clickEditActionButton('Save changes')
        expectDashboardDisplaysInEditMode(TEST_DASHBOARD_TITLE)
    })

    it('A 500 error is thrown when I save the dashboard', () => {
        cy.visit('/', EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))
        openDashboard('Delivery')
        chooseToEditDashboard()
        // A 500 error is thrown when I save the dashboard
        cy.intercept('PUT', '**/dashboards/*', { statusCode: 500 })
        clickEditActionButton('Save changes')

        // Then I remain in edit mode and error message is displayed
        cy.getBySel('dhis2-uicore-alertbar')
            .should('be.visible')
            .should('have.class', 'critical')

        cy.contains('Save changes').should('be.visible')
    })

    it('A 500 error is thrown when I delete the dashboard', () => {
        cy.visit('/', EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))
        openDashboard('Delivery')
        chooseToEditDashboard()

        // And A 500 error is thrown when I delete the dashboard
        cy.intercept('DELETE', '**/dashboards/*', { statusCode: 500 })
        clickEditActionButton('Delete')
        cy.getBySel(confirmActionDialogSel)
            .find('button')
            .contains('Delete')
            .click()

        // Then I remain in edit mode and error message is displayed
        cy.get('[data-test="dhis2-uicore-alertbar"]')
            .should('be.visible')
            .should('have.class', 'critical')

        cy.contains('Save changes').should('be.visible')
    })
})
