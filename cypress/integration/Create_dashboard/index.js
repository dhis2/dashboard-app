import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

let dashboardId

beforeEach(() => {
    cy.loginThroughForm()
})

Given('user selects to create new dashboard', () => {
    cy.visit('/#/new')
})

When('dashboard title is added', () => {
    cy.get('[data-test="dhis2-dashboard-dashboard-title-input"]').type(
        'Test this dashboard'
    )
})

When('dashboard items are added', () => {
    cy.get('[data-test="dhis2-dashboard-item-search"]').click()
    cy.get(
        '[data-test="dhis2-dashboard-menu-item-ANC: 1 and 3 coverage Yearly"]'
    ).click()
    // close the item selector
    cy.get('body').trigger('keydown', { key: 'Escape' })
})

When('dashboard is saved', () => {
    cy.get('[data-test="dhis2-dashboard-save-dashboard-button"]').click()
})

Then('the saved dashboard should display in view mode', () => {
    cy.get('[data-test="dhis2-dashboard-view-dashboard-title"]').contains(
        'Test this dashboard'
    )

    // check that the correct # items are on the dashboard

    cy.location().should(loc => {
        expect(loc.hash).not.to.eq('#/new')
        dashboardId = loc.hash
    })
})

Given('user opens existing dashboard', () => {
    cy.visit(`/${dashboardId}`)
})

When('user chooses to edit dashboard', () => {
    cy.get('[data-test="dhis2-dashboard-link-edit-dashboard"]').click()
})

When('user chooses to delete dashboard', () => {
    cy.get('[data-test="dhis2-dashboard-delete-dashboard-button"]').click()
})

When('user confirms delete', () => {
    cy.get('[data-test="dhis2-dashboard-confirm-delete-dashboard"]').click()
})

Then(
    'the dashboard is deleted and first starred dashboard displayed in view mode',
    () => {
        cy.get('[data-test="dhis2-dashboard-view-dashboard-title"]').contains(
            'Antenatal Care'
        )
    }
)
