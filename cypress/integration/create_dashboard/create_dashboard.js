import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import { dashboardsBar, editBar, titleBar } from '../../elements'
import { expectDashboardTitleToContain } from '../../elements/titleBar'

// the length of the root route of the app (after the slash): #/
const ROOT_ROUTE_LENGTH = 0
// the length of UIDs (after the slash): '#/nghVC4wtyzi'
const UID_LENGTH = 11

const TEST_DASHBOARD_TITLE = new Date().toUTCString()

const ROUTE_EDIT = 'edit'
const ROUTE_NEW = 'new'
const ROUTE_PRINTLAYOUT = 'printlayout'
const ROUTE_PRINTOIPP = 'printoipp'
const nonViewRoutes = [
    ROUTE_NEW,
    ROUTE_EDIT,
    ROUTE_PRINTLAYOUT,
    ROUTE_PRINTOIPP,
]

const getRouteFromHash = hash => {
    const lastSlashIdx = hash.lastIndexOf('/')
    return hash.slice(lastSlashIdx + 1)
}

Given('I choose to create new dashboard', () => {
    dashboardsBar.clickNew()
})

When('dashboard title is added', () => {
    cy.get('[data-test="dashboard-title-input"]').type(TEST_DASHBOARD_TITLE)
})

When('dashboard items are added', () => {
    dashboardsBar.clickItemSearch()
    cy.get('[data-test="menu-item-ANC: 1 and 3 coverage Yearly"]').click()
})

When('escape key is pressed', () => {
    cy.get('body').trigger('keydown', { key: 'Escape' })
    cy.get('[data-test="item-menu]').should('not.be.visible')
})

When('dashboard is saved', () => {
    editBar.clickSave()
})

Then('the saved dashboard should be displayed', () => {
    expectDashboardTitleToContain(TEST_DASHBOARD_TITLE)
})

Then('dashboard displays in view mode', () => {
    cy.location().should(loc => {
        const currentRoute = getRouteFromHash(loc.hash)

        expect(nonViewRoutes).not.to.include(currentRoute)
        expect([ROOT_ROUTE_LENGTH, UID_LENGTH]).to.include(currentRoute.length)
    })
})

Given('I open existing dashboard', () => {
    dashboardsBar.toggleShowMoreButton()
    dashboardsBar.clickChip(TEST_DASHBOARD_TITLE)
})

When('I choose to edit dashboard', () => {
    titleBar.clickEdit()
})

When('I choose to delete dashboard', () => {
    editBar.clickDelete()
})

When('I confirm delete', () => {
    cy.get('[data-test="confirm-delete-dashboard"]').click()
})

When('I cancel delete', () => {
    cy.get('[data-test="cancel-delete-dashboard"]').click()
})

Then('the dashboard displays in edit mode', () => {
    cy.get('[data-test="dashboard-title-input"]').should('exist')

    cy.location().should(loc => {
        expect(getRouteFromHash(loc.hash)).to.eq(ROUTE_EDIT)
    })
})

Then('the dashboard is deleted and first starred dashboard displayed', () => {
    dashboardsBar.toggleShowMoreButton()
    cy.get('[data-test="dhis2-uicore-chip"]')
        .contains(TEST_DASHBOARD_TITLE)
        .should('not.exist')

    cy.get('[data-test="view-dashboard-title"]')
        .should('exist')
        .should('not.be.empty')
})
