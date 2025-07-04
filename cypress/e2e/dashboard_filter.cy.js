import {
    assertFacilityTypeFilterApplied,
    assertFilterRemoved,
    assertOrgUnitFilterApplied,
    assertPeriodFilterApplied,
    removeFilter,
    addFilter,
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
    titleBarSel,
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
    // Then the dashboard displays in view mode and visualizations are visible
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

        // And I add items and save
        // first install a custom app
        cy.request(
            'POST',
            `${getApiBaseUrl()}/api/appHub/${customApp.id}`
        ).then((response) => {
            expect(response.status).to.be.oneOf([204, 201])

            //add the dashboard title
            cy.getByDataTest('dashboard-title-input').type(TEST_DASHBOARD_TITLE)

            // open item selector
            cy.getByDataTest('item-search').click()
            cy.getByDataTest('item-search')
                .find('input')
                .type('Inpatient', { force: true })

            //CHART
            cy.get(
                '[data-test="menu-item-Inpatient: BMI this year by districts"]'
            ).click()

            cy.getByDataTest('dhis2-uicore-layer').click('topLeft')

            cy.getByDataTest('item-search').click()
            cy.getByDataTest('item-search')
                .find('input')
                .type('ipt 2', { force: true })

            //MAP
            cy.get(
                '[data-test="menu-item-ANC: IPT 2 Coverage this year"]'
            ).click()

            // close the item selector
            cy.getByDataTest('dhis2-uicore-layer').click('topLeft')

            //add a custom app item
            cy.getByDataTest('item-search').click()
            cy.getByDataTest('item-search')
                .find('input')
                .type('Role Monitor', { force: true })

            cy.contains('Role Monitor Widget').click()

            // close the item selector
            cy.getByDataTest('dhis2-uicore-layer').click('topLeft')

            //move things so the dashboard is more compact
            // eslint-disable-next-line cypress/unsafe-to-chain-command
            cy.get(`${gridItemSel}.MAP`)
                .trigger('mousedown')
                .trigger('mousemove', { clientX: 650 })
                .trigger('mouseup')

            //save
            cy.get('button').contains('Save changes', EXTENDED_TIMEOUT).click()

            assertDashboardVisible()

            // When I add a "Period" filter
            addFilter('Period')

            // Then the Period filter is applied to the dashboard
            assertPeriodFilterApplied()
            // When I remove the "Period" filter
            removeFilter()
            // Then the filter is removed from the dashboard
            assertFilterRemoved()

            // When I add a "Organisation unit" filter
            addFilter('Organisation unit')

            // Then the Organisation unit filter is applied to the dashboard
            assertOrgUnitFilterApplied()
            // When I remove the "OrgUnit" filter
            removeFilter()
            // Then the filter is removed from the dashboard
            assertFilterRemoved()
            // When I add a "Facility Type" filter
            addFilter('Facility Type')

            // Then the Facility Type filter is applied to the dashboard
            assertFacilityTypeFilterApplied()
        })
    })

    it('adds an Org unit group filter', () => {
        cy.visit('/')

        // Given I open an existing dashboard
        getNavigationMenuItem(TEST_DASHBOARD_TITLE).click()

        // Then the dashboard displays in view mode and visualizations are visible
        assertDashboardVisible()
        // When I add a "Org unit group" filter
        addFilter('Org unit group')
        // Then the Org unit group filter is applied to the dashboard
        assertOrgUnitGroupFilterApplied()
    })
    it('opens the dimensions modal from the filter badge', () => {
        cy.visit('/')

        // Given I open an existing dashboard
        getNavigationMenuItem(TEST_DASHBOARD_TITLE).click()
        // When I add a "Period" filter
        addFilter('Period')
        // And I click on the "Period" filter badge
        cy.get(filterBadgeSel)
            .find('button')
            .contains('Period')
            .click({ force: true })

        // Then the filter modal is opened
        assertFilterModalOpened()

        cy.getByDataTest('dimension-modal')
            .find('button')
            .contains('Cancel')
            .click()

        assertDashboardVisible()

        // Cleanup: delete the dashboard and remove custom app
        cy.get(titleBarSel, EXTENDED_TIMEOUT)
            .find('button')
            .contains('Edit', EXTENDED_TIMEOUT)
            .click()

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
