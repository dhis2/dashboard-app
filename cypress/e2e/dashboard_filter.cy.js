import {
    assertFacilityTypeFilterApplied,
    assertFilterRemoved,
    assertOrgUnitFilterApplied,
    assertPeriodFilterApplied,
    removeFilter,
    addFilter,
    addDashboardItem,
    newButtonSel,
    gridItemSel,
    dashboardTitleSel,
    chartSel,
    mapSel,
    assertOrgUnitGroupFilterApplied,
    getNavigationMenuItem,
    assertFilterModalOpened,
    confirmActionDialogSel,
    filterBadgeSel,
    clickViewActionButton,
    confirmEditMode,
    clickEditActionButton,
} from '../elements/index.js'
import {
    getApiBaseUrl,
    createDashboardTitle,
    EXTENDED_TIMEOUT,
} from '../support/utils.js'

const TEST_DASHBOARD_TITLE = createDashboardTitle('af')

const customApp = {
    name: 'Users-Role-Monitor-Widget',
    id: '5e43908a-3105-4baa-9a00-87a94ebdc034',
}

const assertDashboardVisible = () => {
    // Assert dashboard displays in view mode and visualizations are visible
    cy.get(dashboardTitleSel)
        .should('be.visible')
        .and('contain', TEST_DASHBOARD_TITLE)

    // check for a map canvas and a highcharts element
    cy.get(`${gridItemSel}.VISUALIZATION`).getIframeBody().as('iframe')
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000)
    cy.get('@iframe').find(chartSel).as('chart')
    cy.get('@chart').should('be.visible')

    cy.get(`${gridItemSel}.MAP`).getIframeBody().as('iframe2')
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000)
    cy.get('@iframe2').find(mapSel).as('map')
    cy.get('@map').should('be.visible').should('be.visible')
}

describe('Dashboard Filter Tests', () => {
    it('adds and removes filters', () => {
        cy.visit('/')
        // Start a new dashboard
        cy.get(newButtonSel, EXTENDED_TIMEOUT).click()

        // Add items and save
        // First install a custom app
        cy.request(
            'POST',
            `${getApiBaseUrl()}/api/appHub/${customApp.id}`
        ).then((response) => {
            expect(response.status).to.be.oneOf([204, 201])

            // add the dashboard title
            cy.getByDataTest('dashboard-title-input').type(TEST_DASHBOARD_TITLE)

            // add dashboard items
            addDashboardItem('Inpatient: BMI this year by districts') //CHART
            addDashboardItem('ANC: IPT 2 Coverage this year') //MAP
            addDashboardItem('Role Monitor') //CUSTOM APP

            // move things so the dashboard is more compact
            cy.get(`${gridItemSel}.MAP`).trigger('mousedown')
            cy.document().trigger('mousemove', { clientX: 650 })
            cy.get(`${gridItemSel}.MAP`).trigger('mouseup')

            // save
            cy.get('button').contains('Save changes', EXTENDED_TIMEOUT).click()

            assertDashboardVisible()

            // add a "Period" filter
            addFilter('Period')
            assertPeriodFilterApplied()
            removeFilter()
            assertFilterRemoved()

            // add a "Organisation unit" filter
            addFilter('Organisation unit')
            assertOrgUnitFilterApplied()
            removeFilter()
            assertFilterRemoved()

            // add a "Facility Type" filter
            addFilter('Facility Type')
            assertFacilityTypeFilterApplied()
        })
    })

    it('adds an Org unit group filter', () => {
        cy.visit('/')

        getNavigationMenuItem(TEST_DASHBOARD_TITLE).click()

        assertDashboardVisible()

        addFilter('Org unit group')
        assertOrgUnitGroupFilterApplied()
    })

    it('opens the dimensions modal from the filter badge', () => {
        cy.visit('/')

        getNavigationMenuItem(TEST_DASHBOARD_TITLE).click()

        addFilter('Period')

        // click on the "Period" filter badge
        cy.get(filterBadgeSel)
            .find('button')
            .contains('Period')
            .click({ force: true })

        assertFilterModalOpened()

        cy.getByDataTest('dimension-modal')
            .find('button')
            .contains('Cancel')
            .click()

        assertDashboardVisible()

        // Cleanup: delete the dashboard and remove the custom app
        clickViewActionButton('Edit')
        confirmEditMode()

        clickEditActionButton('Delete')
        cy.get(confirmActionDialogSel).find('button').contains('Delete').click()
        cy.get(dashboardTitleSel)
            .should('be.visible')
            .and('not.contain', TEST_DASHBOARD_TITLE)

        // remove the custom app
        cy.request(
            'DELETE',
            `${getApiBaseUrl()}/api/apps/${customApp.name}`
        ).then((response) => {
            expect(response.status).to.equal(204)
        })
    })
})
