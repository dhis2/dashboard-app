import { dashboards } from '../assets/backends/sierraLeone_236.js'
import {
    getDashboardItem,
    clickItemDeleteButton,
    titleInputSel,
    getNavigationMenuItem,
    dashboardTitleSel,
    dashboardUnstarredSel,
    dashboardStarredSel,
    titleBarSel,
    filterBadgeSel,
    gridItemSel,
    chartSel,
    tableSel,
    dimensionsModalSel,
    filterDimensionsPanelSel,
    itemMenuButtonSel,
    newButtonSel,
    clickEditActionButton,
    addDashboardItem,
    confirmViewMode,
} from '../elements/index.js'
import { EXTENDED_TIMEOUT, createDashboardTitle } from '../support/utils.js'

const ITEM_1_UID = 'GaVhJpqABYX'
const ITEM_2_UID = 'qXsjttMYuoZ'
const ITEM_3_UID = 'Rwb3oXJ3bZ9'

const ROUTE_EDIT = 'edit'

const getRouteFromHash = (hash) => {
    const lastSlashIdx = hash.lastIndexOf('/')
    return hash.slice(lastSlashIdx + 1)
}

const confirmEditMode = () => {
    cy.get(titleInputSel).should('exist')

    cy.location().should((loc) => {
        expect(getRouteFromHash(loc.hash)).to.eq(ROUTE_EDIT)
    })
}

const interceptDashboardRequest = () => {
    cy.intercept(/dashboards\/iMnYyBfSxmM/, (req) => {
        req.reply((res) => {
            // modify 3 items with different styles of "missing" type property
            res.body.dashboardItems.find(
                (item) => item.id === ITEM_1_UID
            ).type = null

            const item = res.body.dashboardItems.find(
                (item) => item.id === ITEM_2_UID
            )

            delete item.type

            res.body.dashboardItems.find(
                (item) => item.id === ITEM_3_UID
            ).type = 'Unrecognized'

            res.send({ body: res.body })
        })
    })
}

const assertDashboardNotFound = () => {
    //     Then a message displays informing that the dashboard is not found
    cy.contains('Requested dashboard not found').should('be.visible')
    cy.get(dashboardTitleSel).should('not.exist')
}

const assertItemsMissingTypeDisplayWithWarning = () => {
    // Check that the items are displayed with a warning
    getDashboardItem(ITEM_1_UID)
        .scrollIntoView()
        .contains('The item type is missing')
        .should('be.visible')

    getDashboardItem(ITEM_2_UID)
        .scrollIntoView()
        .contains('The item type is missing')
        .should('be.visible')

    getDashboardItem(ITEM_3_UID)
        .scrollIntoView()
        .contains('Item type "Unrecognized" is not supported')
        .should('be.visible')
}

it("navigates to a dashboard that doesn't exist or user doesn't have access to", () => {
    cy.visit('#/invalid')

    assertDashboardNotFound()

    // Open the Delivery dashboard
    getNavigationMenuItem('Delivery').click()

    // Check that the Delivery dashboard title is displayed
    cy.get(dashboardTitleSel).should('be.visible').and('contain', 'Delivery')
})

it("navigates to edit dashboard that doesn't exist", () => {
    cy.visit('#/invalid/edit')

    assertDashboardNotFound()

    // Now open the Delivery dashboard
    getNavigationMenuItem('Delivery').click()

    // Check that the Delivery dashboard title is displayed
    cy.get(dashboardTitleSel).should('be.visible').and('contain', 'Delivery')
})

it('navigates to a dashboard that fails to load', () => {
    cy.intercept(`**/dashboards/${dashboards.Immunization.id}?*`, {
        statusCode: 500,
        body: 'Oopsie!',
    }).as('dashboard500')

    cy.visit(dashboards.Immunization.route, EXTENDED_TIMEOUT)
    cy.wait('@dashboard500')

    cy.contains('Load dashboard failed').should('exist')
    cy.contains(
        'This dashboard could not be loaded. Please try again later.'
    ).should('exist')
})

it('enters edit mode of a dashboard I do not have access to edit', () => {
    cy.intercept(`**/dashboards/${dashboards.Delivery.id}?*`, (req) => {
        req.reply((res) => {
            const noAccessResponse = {
                ...res.body,
                access: { update: false, delete: false },
            }

            res.send(noAccessResponse)
        })
    })

    cy.visit(`${dashboards.Delivery.route}/edit`, EXTENDED_TIMEOUT)

    cy.contains('Go to dashboards', EXTENDED_TIMEOUT).should('be.visible')
    cy.contains('No access').should('be.visible')
})

it('displays dashboard containing item that is missing type', () => {
    interceptDashboardRequest()
    cy.visit('/')
    getNavigationMenuItem('Delivery').click()

    // Check that the dashboard title is displayed
    cy.get(dashboardTitleSel).should('be.visible').and('contain', 'Delivery')

    // Check that the items are displayed with a warning
    assertItemsMissingTypeDisplayWithWarning()
})

it('starring a dashboard fails', () => {
    cy.visit(dashboards.Delivery.route, EXTENDED_TIMEOUT)

    // Click to star dashboard fails
    cy.log('url', `dashboards/${dashboards.Delivery.id}/favorite`)
    cy.intercept('POST', `**/dashboards/${dashboards.Delivery.id}/favorite`, {
        statusCode: 409,
    }).as('starDashboardFail')

    cy.get(dashboardUnstarredSel).click()
    cy.wait('@starDashboardFail').its('response.statusCode').should('eq', 409)

    // Warning message is displayed stating that starring dashboard failed
    cy.get('[data-test="dhis2-uicore-alertbar"]')
        .should('be.visible')
        .should('have.class', 'warning')

    cy.contains('Failed to star the dashboard').should('be.visible')

    // Dashboard is not starred
    cy.get(dashboardUnstarredSel).should('be.visible')
    cy.get(dashboardStarredSel).should('not.exist')
})

it('displays dashboard in edit mode containing item that is missing type', () => {
    interceptDashboardRequest()
    cy.visit('/')
    getNavigationMenuItem('Delivery').click()

    // Check that the dashboard title is displayed
    cy.get(dashboardTitleSel).should('be.visible').and('contain', 'Delivery')

    // Click the edit button
    cy.get(titleBarSel, EXTENDED_TIMEOUT)
        .find('button')
        .contains('Edit', EXTENDED_TIMEOUT)
        .click()

    confirmEditMode()

    assertItemsMissingTypeDisplayWithWarning()

    // Check that the items can be deleted
    clickItemDeleteButton(ITEM_1_UID)
    clickItemDeleteButton(ITEM_2_UID)
    clickItemDeleteButton(ITEM_3_UID)

    getDashboardItem(ITEM_1_UID).should('not.exist')
    getDashboardItem(ITEM_2_UID).should('not.exist')
    getDashboardItem(ITEM_3_UID).should('not.exist')
})

it('displays print mode for dashboard containing item that is missing type', () => {
    // Open the Delivery dashboard with items missing a type
    interceptDashboardRequest()
    cy.visit('/')
    getNavigationMenuItem('Delivery').click()

    // Click to preview the print layout
    cy.getByDataTest('more-actions-button').click()
    cy.getByDataTest('print-menu-item').click()
    cy.getByDataTest('print-layout-menu-item').click()

    // Print layout displays for Delivery dashboard
    cy.location().should((loc) => {
        expect(loc.hash).to.equal(`${dashboards.Delivery.route}/printlayout`)
    })

    // Check for some elements
    cy.getByDataTest('print-layout-page').should('be.visible')

    // Check that the items are displayed with a warning
    assertItemsMissingTypeDisplayWithWarning()
})

const TEST_DASHBOARD_TITLE = createDashboardTitle('a-view-error')
it.skip('filtering causes visualization to fail while in print mode', () => {
    cy.visit('/')

    // Create a dashboard with a dual-axis chart
    cy.get(newButtonSel, EXTENDED_TIMEOUT).click()
    cy.getByDataTest('dashboard-title-input').type(TEST_DASHBOARD_TITLE)
    addDashboardItem(
        'ANC: ANC reporting rate, coverage and visits last 4 quarters dual-axis'
    ) // chart
    clickEditActionButton('Save changes')
    confirmViewMode(TEST_DASHBOARD_TITLE)

    // Apply a "Diagnosis" filter of type "Burns"
    addFilter('Diagnosis', 'Burns')

    // Assert an error message is displayed on the item
    assertErrorOnItem()

    // Click to preview the print layout
    cy.getByDataTest('more-actions-button').click()
    cy.getByDataTest('print-menu-item').click()
    cy.getByDataTest('print-layout-menu-item').click()

    // Assert an error message not including a link is displayed on the item
    cy.contains(
        'There was an error loading data for this item'
    ).scrollIntoView()
    cy.contains('There was an error loading data for this item').should(
        'be.visible'
    )
    cy.contains('Open this item in Data Visualizer').should('not.exist')
    cy.get(`${gridItemSel}.VISUALIZATION`)
        .first()
        .find('iframe')
        .should('not.exist')

    // Exit print preview
    cy.get('button').not('.small').contains('Exit print preview').click()
    confirmViewMode(TEST_DASHBOARD_TITLE)

    // Remove the filter
    cy.get(filterBadgeSel).scrollIntoView()
    cy.get(filterBadgeSel).contains('Remove').click()

    // Assert the filter is removed
    cy.get(filterBadgeSel).should('not.exist')

    // Assert the chart is displayed
    cy.get(`${gridItemSel}.VISUALIZATION`)
        .first()
        .getIframeBody()
        .find(chartSel)
        .should('be.visible')
})

it.skip('filtering causes visualization to fail when viewed as table', () => {
    //     Given I open a dashboard with a chart that will fail
    cy.visit('/')
    getNavigationMenuItem(TEST_DASHBOARD_TITLE).click()
    confirmViewMode(TEST_DASHBOARD_TITLE)

    // Apply a "Diagnosis" filter of type "Burns"
    addFilter('Diagnosis', 'Burns')

    // Assert error message is displayed on the item
    cy.get(`${gridItemSel}.VISUALIZATION`)
        .first()
        .contains('There was an error loading data for this item')
        .should('be.visible')

    // View as table
    cy.get(itemMenuButtonSel).click()
    cy.contains('View as Pivot table').click()

    // Assert error message is displayed on the item
    assertErrorOnItem()

    // Remove the filter
    cy.wait(4000) // eslint-disable-line cypress/no-unnecessary-waiting
    cy.get(filterBadgeSel).scrollIntoView()
    cy.get(filterBadgeSel).contains('Remove').click()
    cy.get(filterBadgeSel).should('not.exist')
    cy.wait(4000) // eslint-disable-line cypress/no-unnecessary-waiting

    // Assert table is displayed
    cy.get(`${gridItemSel}.VISUALIZATION`)
        .first()
        .getIframeBody()
        .find(tableSel)
        .should('be.visible')
})

it.skip('filtering causes visualization to faile while view as table then as chart', () => {
    cy.visit('/')
    getNavigationMenuItem(TEST_DASHBOARD_TITLE).click()
    confirmViewMode(TEST_DASHBOARD_TITLE)

    // Apply a "Diagnosis" filter of type "Burns"
    addFilter('Diagnosis', 'Burns')

    // Assert error message is displayed on the item
    assertErrorOnItem()
    // View as table
    cy.get(itemMenuButtonSel).click()
    cy.contains('View as Pivot table').click()

    // Assert error message is displayed on the item
    assertErrorOnItem()

    // View as chart
    cy.get(itemMenuButtonSel).click()
    cy.contains('View as Chart').click()

    // Assert error message is displayed on the item
    assertErrorOnItem()

    // Remove the filter
    cy.wait(4000) // eslint-disable-line cypress/no-unnecessary-waiting
    cy.get(filterBadgeSel).scrollIntoView()
    cy.get(filterBadgeSel).contains('Remove').click()
    cy.get(filterBadgeSel).should('not.exist')
    cy.wait(4000) // eslint-disable-line cypress/no-unnecessary-waiting

    // Assert the chart is displayed
    cy.get(`${gridItemSel}.VISUALIZATION`)
        .first()
        .getIframeBody()
        .find(chartSel)
        .should('be.visible')
})

const addFilter = (dimensionType, filterName) => {
    cy.containsExact('Filter').click()
    cy.get(filterDimensionsPanelSel).contains(dimensionType).click()
    cy.get(dimensionsModalSel, EXTENDED_TIMEOUT).should('be.visible')

    cy.contains(filterName).dblclick()

    cy.get('button').contains('Confirm').click()
}

const assertErrorOnItem = () => {
    cy.get(`${gridItemSel}.VISUALIZATION`)
        .first()
        .contains('There was an error loading data for this item')
        .should('be.visible')

    cy.get(`${gridItemSel}.VISUALIZATION`)
        .first()
        .contains('Open this item in Data Visualizer')
        .should('be.visible')

    cy.get(`${gridItemSel}.VISUALIZATION`)
        .first()
        .getIframeBody()
        .find(chartSel)
        .should('not.exist')
}
