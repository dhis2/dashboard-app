import {
    getNavigationMenuItem,
    confirmViewMode,
    confirmEditMode,
    clickViewActionButton,
    clickEditActionButton,
    confirmActionDialogSel,
} from '../elements/index.js'

describe('Edit Dashboard Errors', () => {
    it('shows error when saving a dashboard without access', () => {
        cy.visit('/')
        // Open the "Delivery" dashboard
        getNavigationMenuItem('Delivery').click()
        confirmViewMode('Delivery')

        // Choose to edit dashboard
        clickViewActionButton('Edit')
        confirmEditMode()

        // Set up intercept to simulate 409 error (no access)
        cy.intercept('PUT', '**/dashboards/*', { statusCode: 409 }).as(
            'saveDashboard'
        )

        // Try to save dashboard that user doesn't have access to save
        clickEditActionButton('Save changes')

        // Wait for the intercepted request
        cy.wait('@saveDashboard')

        // Assert I remain in edit mode and error message is displayed
        cy.getByDataTest('dhis2-uicore-alertbar')
            .should('have.class', 'critical')
            .contains('Failed to save dashboard')
            .should('be.visible')

        cy.contains('Save changes').should('be.visible')

        // Verify still in edit mode
        confirmEditMode()
    })

    it('shows error when 500 error is thrown while saving dashboard', () => {
        cy.visit('/')
        // Open the "Delivery" dashboard
        getNavigationMenuItem('Delivery').click()
        confirmViewMode('Delivery')

        // Choose to edit dashboard
        clickViewActionButton('Edit')
        confirmEditMode()

        // Set up intercept to simulate 500 error
        cy.intercept('PUT', '**/dashboards/*', { statusCode: 500 }).as(
            'saveDashboard'
        )

        // Try to save dashboard and trigger 500 error
        clickEditActionButton('Save changes')

        // Wait for the intercepted request
        cy.wait('@saveDashboard')

        // Assert I remain in edit mode and error message is displayed
        cy.getByDataTest('dhis2-uicore-alertbar')
            .should('have.class', 'critical')
            .contains('Failed to save dashboard')
            .should('be.visible')

        cy.contains('Save changes').should('be.visible')

        // Verify still in edit mode
        confirmEditMode()
    })

    it('shows error when 500 error is thrown while deleting dashboard', () => {
        cy.visit('/')
        // Open the "Delivery" dashboard
        getNavigationMenuItem('Delivery').click()
        confirmViewMode('Delivery')

        // Choose to edit dashboard
        clickViewActionButton('Edit')
        confirmEditMode()

        // Set up intercept to simulate 500 error on delete
        cy.intercept('DELETE', '**/dashboards/*', { statusCode: 500 }).as(
            'deleteDashboard'
        )

        // Try to delete dashboard and trigger 500 error
        clickEditActionButton('Delete')
        cy.get(confirmActionDialogSel).find('button').contains('Delete').click()

        // Wait for the intercepted request
        cy.wait('@deleteDashboard')

        // Assert I remain in edit mode and error message is displayed
        cy.getByDataTest('dhis2-uicore-alertbar')
            .should('have.class', 'critical')
            .contains('Failed to delete dashboard')
            .should('be.visible')

        cy.contains('Save changes').should('be.visible')

        // Verify still in edit mode
        confirmEditMode()
    })
})
