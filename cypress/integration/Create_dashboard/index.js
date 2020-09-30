import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

const UID_LENGTH = 11

const dashboardTitle = new Date().toString()

const ROUTE_EDIT = 'edit'
const ROUTE_NEW = 'new'
const ROUTE_PRINTLAYOUT = 'printlayout'
const ROUTE_PRINTOIPP = 'printoipp'

const getRouteFromHash = hash => {
    const lastSlashIdx = hash.lastIndexOf('/')
    return hash.slice(lastSlashIdx + 1)
}

Given('user chooses to create new dashboard', () => {
    cy.get('[data-test="dhis2-dashboard-link-new-dashboard"]').click()
})

When('dashboard title is added', () => {
    cy.get('[data-test="dhis2-dashboard-dashboard-title-input"]').type(
        dashboardTitle
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

Then('the saved dashboard should be displayed', () => {
    cy.get('[data-test="dhis2-dashboard-view-dashboard-title"]').contains(
        dashboardTitle
    )
})

Then('dashboard displays in view mode', () => {
    cy.location().should(loc => {
        const nonViewRoutes = [
            ROUTE_NEW,
            ROUTE_EDIT,
            ROUTE_PRINTLAYOUT,
            ROUTE_PRINTOIPP,
        ]
        const currentRoute = getRouteFromHash(loc.hash)

        expect(nonViewRoutes).not.to.include(currentRoute)
        expect([0, UID_LENGTH]).to.include(currentRoute.length)
    })
})

Given('user opens existing dashboard', () => {
    cy.get('[data-test="dhis2-dashboard-showmore-button"]').click()
    cy.get('[data-test="dhis2-dashboard-dashboard-chip"]')
        .contains(dashboardTitle)
        .click()
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

When('user cancels delete', () => {
    cy.get('[data-test="dhis2-dashboard-cancel-delete-dashboard"]').click()
})

Then('the dashboard displays in edit mode', () => {
    cy.get('[data-test="dhis2-dashboard-dashboard-title-input"]').should(
        'exist'
    )

    cy.location().should(loc => {
        expect(getRouteFromHash(loc.hash)).to.eq(ROUTE_EDIT)
    })
})

Then('the dashboard is deleted and first starred dashboard displayed', () => {
    cy.get('[data-test="dhis2-dashboard-showmore-button"]').click()
    cy.get('[data-test="dhis2-dashboard-dashboard-chip"]')
        .contains(dashboardTitle)
        .should('not.exist')

    cy.get('[data-test="dhis2-dashboard-view-dashboard-title"]')
        .should('exist')
        .should('not.be.empty')
})
