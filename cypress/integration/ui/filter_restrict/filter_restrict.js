import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import { dashboardChipSel } from '../../../selectors/viewDashboard'
import { filterDimensionsPanelSel } from '../../../selectors/dashboardFilter'

const TEST_DASHBOARD_PREFIX = 'TEST_FILTER_SETTINGS'
const TEST_DASHBOARD_TITLE = `${TEST_DASHBOARD_PREFIX}-${new Date().toUTCString()}`

const toggleShowMoreButton = () => {
    cy.get('[data-test="showmore-button"]').click()
}

/*
Background
*/

before(() => {
    cy.request(
        `http://localhost:8080/api/dashboards?paging=false&fields=id&filter=name:like:${TEST_DASHBOARD_PREFIX}`
    ).then(resp => {
        try {
            resp.body.dashboards.forEach(dashboard => {
                cy.request(
                    'DELETE',
                    `http://localhost:8080/api/dashboards/${dashboard.id}`
                )
            })
        } catch (e) {
            console.log(`${TEST_DASHBOARD_PREFIX} dashboards not deleted`)
        }
    })
})

/*
Scenario: I create a new dashboard and have no Filter Restrictions
*/

When('I add a dashboard title', () => {
    cy.get('[data-test="dashboard-title-input"]').type(TEST_DASHBOARD_TITLE)
})

When('I click on Filter Settings', () => {
    cy.get('button').contains('Filter Settings').click()
})

Then('Filter Settings are not restricted, and I can save the dashboard', () => {
    cy.get('[name="radio-allow-filtering-on-all"]').should('be.checked')
    cy.get('[data-test="dhis2-uicore-layer"]').click('topLeft')
    cy.get('button').contains('Save changes').click()
})

/*
Scenario: I change Filter Restrictions, do not confirm them, and the restrictions remain unchanged when I click back
*/

Given(
    'I open an existing dashboard with non-restricted filter settings in edit mode',
    () => {
        toggleShowMoreButton()
        cy.get(dashboardChipSel).contains(TEST_DASHBOARD_TITLE).click()
        cy.get('button').contains('Edit').click()
    }
)

When('I click to restrict filter settings', () => {
    cy.get('[name="radio-restrict-filtering"]').parent().click()
})

When('I click away without confirming', () => {
    cy.get('[data-test="dhis2-uicore-layer"]').click('topLeft')
})

Then('Filter Restrictions are not restricted', () => {
    cy.get('[name="radio-allow-filtering-on-all"]').should('be.checked')
})

/*
Scenario: I see Period and Organisation Unit if newly choosing to restrict dimensions
*/

Then(
    'Period and Organisation Unit are displayed as selected by default',
    () => {
        cy.get('[data-test="dhis2-uicore-transfer-rightside"]').contains(
            'Period'
        )
        cy.get('[data-test="dhis2-uicore-transfer-rightside"]').contains(
            'Organisation Unit'
        )
    }
)

/*
Scenario: I change Filter Restrictions and the changes persist while editing Filter Settings
*/

When('I add Facility Ownership to selected filters', () => {
    cy.get('div').contains('Facility Ownership').click()
    cy.get('[data-test="dhis2-uicore-transfer-actions-addindividual"]').click()
})

When('I click to allow all filters', () => {
    cy.get('[name="radio-allow-filtering-on-all"]').parent().click()
})

Then(
    'Filter Restrictions are restricted and Facility Ownership is selected',
    () => {
        cy.get('[name="radio-restrict-filtering"]').should('be.checked')
        cy.get('[data-test="dhis2-uicore-transfer-rightside"]').contains(
            'Facility Ownership'
        )
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

When('I click Exit without saving', () => {
    cy.get('button').contains('Exit without saving').click()
})

When('I open Edit mode', () => {
    cy.get('button').contains('Edit').click()
})

/*
Scenario: I change Filter Restrictions, save dashboard and can see the changes in filter dimensions panel
*/

When('I remove all filters from selected filters', () => {
    cy.get('[data-test="dhis2-uicore-transfer-actions-removeall"]').click()
})

When('I save the dashboard', () => {
    cy.get('button').contains('Save changes').click()
})

When('I click Add Filter', () => {
    cy.contains('Add filter').click()
})

Then('I see Facility Ownership and no other dimensions', () => {
    cy.get(filterDimensionsPanelSel).contains('Facility Ownership')
    cy.get(filterDimensionsPanelSel)
        .get('ul')
        .eq(0)
        .find('li')
        .should('not.exist')
    cy.get(filterDimensionsPanelSel)
        .get('ul')
        .eq(1)
        .find('li')
        .should('have.length', 1)
})

/*
Scenario: I restrict filters to no dimensions and do not see Add Filter in dashboard
*/

Then('Add Filter button is not visible', () => {
    cy.contains('Add filter').should('not.exist')
})
