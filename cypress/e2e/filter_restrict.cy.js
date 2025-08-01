import {
    dashboardTitleSel,
    clickViewActionButton,
    clickEditActionButton,
    titleInputSel,
    confirmActionDialogSel,
    filterDimensionsPanelSel,
    newButtonSel,
    closeModal,
} from '../elements/index.js'
import { createDashboardTitle } from '../support/utils.js'

const TEST_DASHBOARD_TITLE = createDashboardTitle('aaa')

describe('Filter Restrictions', () => {
    let dashboardId

    it.only('creates a new dashboard with no Filter Restrictions', () => {
        cy.visit('/')
        // Start a new dashboard
        cy.get(newButtonSel).click()

        // Add a dashboard title
        cy.get(titleInputSel).type(TEST_DASHBOARD_TITLE)

        // Click on Filter settings
        clickEditActionButton('Filter settings')

        // Assert Filter settings are not restricted, and I can save the dashboard
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

    it.only('changes Filter Restrictions but they do not persist when clicking away without confirming', () => {
        // Open an existing dashboard with non-restricted Filter settings in edit mode
        cy.visit(`/${dashboardId}/edit`)

        // Click on Filter settings
        clickEditActionButton('Filter settings')

        // Click to restrict Filter settings
        cy.contains('Only allow filtering by selected dimensions')
            .parent()
            .click()

        // Click away without confirming
        closeModal()

        // Click on Filter settings again
        clickEditActionButton('Filter settings')

        // Assert Filter Restrictions are not restricted
        cy.contains('Allow filtering by all dimensions')
            .find('input')
            .should('be.checked')

        closeModal()
    })

    it.only('shows Period and Organisation unit as selected by default when restricting dimensions', () => {
        // Open an existing dashboard with non-restricted Filter settings in edit mode
        cy.visit(`/${dashboardId}/edit`)

        // Click on Filter settings
        clickEditActionButton('Filter settings')

        // Click to restrict Filter settings
        cy.contains('Only allow filtering by selected dimensions')
            .parent()
            .click()

        // Assert Period and Organisation unit are displayed as selected by default
        cy.get('[data-test="dhis2-uicore-transfer-rightside"]')
            .contains('Period')
            .should('be.visible')
        cy.get('[data-test="dhis2-uicore-transfer-rightside"]')
            .contains('Organisation unit')
            .should('be.visible')

        closeModal()
    })

    it.only('persists Filter Restrictions changes while editing Filter settings', () => {
        // Open an existing dashboard with non-restricted Filter settings in edit mode
        cy.visit(`/${dashboardId}/edit`)

        // Click on Filter settings
        clickEditActionButton('Filter settings')

        // Click to restrict Filter settings
        cy.contains('Only allow filtering by selected dimensions')
            .parent()
            .click()

        // Add Facility Ownership to selected filters
        cy.get('div').contains('Facility Ownership').click()
        cy.getByDataTest('dhis2-uicore-transfer-actions-addindividual').click()

        // Click to allow all filters
        cy.contains('Allow filtering by all dimensions').parent().click()

        // Click to restrict Filter settings again
        cy.contains('Only allow filtering by selected dimensions')
            .parent()
            .click()

        // Assert Filter Restrictions are restricted and Facility Ownership is selected
        cy.contains('Only allow filtering by selected dimensions')
            .find('input')
            .should('be.checked')
        cy.getByDataTest('dhis2-uicore-transfer-rightside')
            .contains('Facility Ownership')
            .should('be.visible')

        closeModal()
    })

    it.only('persists Filter Restrictions changes after clicking confirm', () => {
        // Open an existing dashboard with non-restricted Filter settings in edit mode
        cy.visit(`/${dashboardId}/edit`)

        // Click on Filter settings
        clickEditActionButton('Filter settings')

        // Click to restrict Filter settings
        cy.contains('Only allow filtering by selected dimensions')
            .parent()
            .click()

        // Add Facility Ownership to selected filters
        cy.get('div').contains('Facility Ownership').click()
        cy.getByDataTest('dhis2-uicore-transfer-actions-addindividual').click()

        // Click Confirm
        cy.get('button').contains('Confirm').click()

        // Click on Filter settings again
        clickEditActionButton('Filter settings')

        // Assert Filter Restrictions are restricted and Facility Ownership is selected
        cy.contains('Only allow filtering by selected dimensions')
            .find('input')
            .should('be.checked')
        cy.getByDataTest('"dhis2-uicore-transfer-rightside')
            .contains('Facility Ownership')
            .should('be.visible')

        closeModal()
    })

    it.only('does not persist Filter Restrictions changes when exiting without saving', () => {
        // Open an existing dashboard with non-restricted Filter settings in edit mode
        cy.visit(`/${dashboardId}/edit`)

        // Click on Filter settings
        clickEditActionButton('Filter settings')

        // Click to restrict Filter settings
        cy.contains('Only allow filtering by selected dimensions')
            .parent()
            .click()

        // Add Facility Ownership to selected filters
        cy.get('div').contains('Facility Ownership').click()
        cy.getByDataTest('dhis2-uicore-transfer-actions-addindividual').click()

        // Click Confirm
        cy.get('button').contains('Confirm').click()

        // Click Exit without saving
        clickEditActionButton('Exit without saving')

        // Assert dashboard displays in view mode
        cy.get(dashboardTitleSel)
            .should('be.visible')
            .and('contain', TEST_DASHBOARD_TITLE)

        // Choose to edit dashboard
        clickViewActionButton('Edit')

        // Click on Filter settings
        clickEditActionButton('Filter settings')

        // Assert Filter Restrictions are not restricted
        cy.contains('Allow filtering by all dimensions')
            .find('input')
            .should('be.checked')

        closeModal()
    })

    it('saves Filter Restrictions changes and shows them in filter dimensions panel', () => {
        // Open an existing dashboard with non-restricted Filter settings in edit mode
        cy.visit(`/${dashboardId}/edit`)

        // Click on Filter settings
        clickEditActionButton('Filter settings')

        // Click to restrict Filter settings
        cy.contains('Only allow filtering by selected dimensions')
            .parent()
            .click()

        // Remove all filters from selected filters
        cy.get('[data-test="dhis2-uicore-transfer-actions-removeall"]').click()

        // Add Facility Ownership to selected filters
        cy.get('div').contains('Facility Ownership').click()
        cy.get(
            '[data-test="dhis2-uicore-transfer-actions-addindividual"]'
        ).click()

        // Click Confirm
        cy.get('button').contains('Confirm').click()

        // Save the dashboard
        clickEditActionButton('Save changes')

        // Click Add Filter
        clickViewActionButton('Filter')

        // Assert I see Facility Ownership and no other dimensions
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

        // Close the filter panel
        closeModal()
    })

    it('restricts filters to no dimensions and hides Add Filter button', () => {
        // Open an existing dashboard with non-restricted Filter settings in edit mode
        cy.visit(`/${dashboardId}/edit`)

        // Click on Filter settings
        clickEditActionButton('Filter settings')

        // Click to restrict Filter settings
        cy.contains('Only allow filtering by selected dimensions')
            .parent()
            .click()

        // Remove all filters from selected filters
        cy.get('[data-test="dhis2-uicore-transfer-actions-removeall"]').click()

        // Click Confirm
        cy.get('button').contains('Confirm').click()

        // Save the dashboard
        clickEditActionButton('Save changes')

        // Assert Add Filter button is not visible
        cy.containsExact('Filter').should('not.exist')

        // Assert dashboard displays in view mode
        cy.get(dashboardTitleSel)
            .should('be.visible')
            .and('contain', TEST_DASHBOARD_TITLE)

        // Choose to edit dashboard
        clickViewActionButton('Edit')

        // Delete the dashboard
        clickEditActionButton('Delete')
        cy.get(confirmActionDialogSel).find('button').contains('Delete').click()

        // Assert another dashboard displays in view mode
        cy.get(dashboardTitleSel)
            .should('be.visible')
            .and('not.contain', TEST_DASHBOARD_TITLE)
    })
})
