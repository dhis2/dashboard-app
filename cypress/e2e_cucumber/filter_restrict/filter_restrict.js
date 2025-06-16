import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import { filterDimensionsPanelSel } from '../../elements/dashboardFilter.js'
import {
    titleInputSel,
    confirmActionDialogSel,
    clickEditActionButton,
} from '../../elements/editDashboard.js'
import {
    dashboardTitleSel,
    clickViewActionButton,
} from '../../elements/viewDashboard.js'
import { createDashboardTitle } from '../../support/utils.js'

const TEST_DASHBOARD_TITLE = createDashboardTitle('aaa')

let dashboardId

const closeModal = () =>
    cy.get('[data-test="dhis2-uicore-layer"]').click('topLeft')

/*
Scenario: I create a new dashboard and have no Filter Restrictions
*/

When('I add a dashboard title', () => {
    cy.get(titleInputSel).type(TEST_DASHBOARD_TITLE)
})

When('I click on Filter settings', () => {
    clickEditActionButton('Filter settings')
})

Then('Filter settings are not restricted, and I can save the dashboard', () => {
    cy.contains('Allow filtering by all dimensions')
        .find('input')
        .should('be.checked')

    closeModal()

    clickEditActionButton('Save changes')

    cy.get(dashboardTitleSel)
        .should('be.visible')
        .and('contain', TEST_DASHBOARD_TITLE)

    cy.location().should((loc) => {
        dashboardId = loc.hash
    })
})

/*
Scenario: I change Filter Restrictions, do not confirm them, and the restrictions remain unchanged when I click back
*/

Given(
    'I open an existing dashboard with non-restricted Filter settings in edit mode',
    () => {
        cy.visit(`/${dashboardId}/edit`)
    }
)

When('I click to restrict Filter settings', () => {
    cy.contains('Only allow filtering by selected dimensions').parent().click()
})

When('I click away without confirming', () => {
    //close modal
    closeModal()
})

Then('Filter Restrictions are not restricted', () => {
    cy.contains('Allow filtering by all dimensions')
        .find('input')
        .should('be.checked')
})

/*
Scenario: I see Period and Organisation unit if newly choosing to restrict dimensions
*/

Then(
    'Period and Organisation unit are displayed as selected by default',
    () => {
        cy.get('[data-test="dhis2-uicore-transfer-rightside"]')
            .contains('Period')
            .should('be.visible')
        cy.get('[data-test="dhis2-uicore-transfer-rightside"]')
            .contains('Organisation unit')
            .should('be.visible')
    }
)

/*
Scenario: I change Filter Restrictions and the changes persist while editing Filter settings
*/

When('I add Facility Ownership to selected filters', () => {
    cy.get('div').contains('Facility Ownership').click()
    cy.get('[data-test="dhis2-uicore-transfer-actions-addindividual"]').click()
})

When('I click to allow all filters', () => {
    cy.contains('Allow filtering by all dimensions').parent().click()
})

Then(
    'Filter Restrictions are restricted and Facility Ownership is selected',
    () => {
        cy.contains('Only allow filtering by selected dimensions')
            .find('input')
            .should('be.checked')
        cy.get('[data-test="dhis2-uicore-transfer-rightside"]')
            .contains('Facility Ownership')
            .should('be.visible')
    }
)

/*
Scenario: I change Filter Restrictions and the changes persist after clicking confirm
*/

When('I click Confirm', () => {
    cy.get('button').contains('Confirm').click()
})

/*
Scenario: I change Filter Restrictions and the changes do not persist if I click 'Exit without saving'
*/

Then('dashboard displays in view mode', () => {
    cy.get(dashboardTitleSel)
        .should('be.visible')
        .and('contain', TEST_DASHBOARD_TITLE)
})

/*
Scenario: I change Filter Restrictions, save dashboard and can see the changes in filter dimensions panel
*/

When('I remove all filters from selected filters', () => {
    cy.get('[data-test="dhis2-uicore-transfer-actions-removeall"]').click()
})

When('I save the dashboard', () => {
    clickEditActionButton('Save changes')
})

When('I click Add Filter', () => {
    clickViewActionButton('Filter')
})

Then('I see Facility Ownership and no other dimensions', () => {
    cy.get(filterDimensionsPanelSel)
        .contains('Facility Ownership')
        .should('be.visible')
    cy.get(filterDimensionsPanelSel)
        .contains('MAIN DIMENSIONS', { matchCase: false })
        .should('not.exist')
    cy.get(filterDimensionsPanelSel)
        .contains('YOUR DIMENSIONS', { matchCase: false })
        .next('ul')
        .find('li')
        .should('have.length', 1)
})

/*
Scenario: I restrict filters to no dimensions and do not see Add Filter in dashboard
*/

Then('Add Filter button is not visible', () => {
    cy.containsExact('Filter').should('not.exist')
})

When('I delete the dashboard', () => {
    clickEditActionButton('Delete')
    cy.get(confirmActionDialogSel).find('button').contains('Delete').click()
})

Then('another dashboard displays in view mode', () => {
    cy.get(dashboardTitleSel)
        .should('be.visible')
        .and('not.contain', TEST_DASHBOARD_TITLE)
})
