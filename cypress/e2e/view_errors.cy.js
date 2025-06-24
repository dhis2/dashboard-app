import { dashboards } from '../assets/backends/sierraLeone_236.js'
import {
    getDashboardItem,
    clickItemDeleteButton,
} from '../elements/dashboardItem.js'
import { titleInputSel } from '../elements/editDashboard.js'
import { getNavigationMenuItem } from '../elements/navigationMenu.js'
import {
    dashboardTitleSel,
    dashboardUnstarredSel,
    dashboardStarredSel,
    titleBarSel,
} from '../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT } from '../support/utils.js'

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

// Scenario: I navigate to a dashboard that doesn't exist or I don't have access to
//     Given I type an invalid dashboard id in the browser url
//     Then a message displays informing that the dashboard is not found
//     When I open the "Delivery" dashboard
//     Then the "Delivery" dashboard displays in view mode
it("Navigate to a dashboard that doesn't exist or I don't have access to", () => {
    //     Given I type an invalid dashboard id in the browser url
    cy.visit('#/invalid')

    assertDashboardNotFound()
    // Now open the Delivery dashboard
    getNavigationMenuItem('Delivery').click()

    // Check that the "Delivery" dashboard title is displayed
    cy.get(dashboardTitleSel).should('be.visible').and('contain', 'Delivery')
})

// Scenario: I navigate to edit dashboard that doesn't exist
//     Given I type an invalid edit dashboard id in the browser url
//     Then a message displays informing that the dashboard is not found
//     When I open the "Delivery" dashboard
//     Then the "Delivery" dashboard displays in view mode
it("Navigate to edit dashboard that doesn't exist", () => {
    // Type an invalid edit dashboard id in the browser url
    cy.visit('#/invalid/edit')

    assertDashboardNotFound()

    // Now open the Delivery dashboard
    getNavigationMenuItem('Delivery').click()

    // Check that the "Delivery" dashboard title is displayed
    cy.get(dashboardTitleSel).should('be.visible').and('contain', 'Delivery')
})

// Scenario: I navigate to a dashboard that fails to load
//     Given I type a dashboard id in the browser url that fails to load
//     Then a warning message is displayed stating that the dashboard could not be loaded
it('Navigate to a dashboard that fails to load', () => {
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

// Scenario: I enter edit mode of a dashboard I do not have access to edit
//     Given I open a non-editable dashboard in edit mode
//     Then only the option to return to view mode is available
it('Enter edit mode of a dashboard I do not have access to edit', () => {
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

// Scenario: View dashboard containing item that is missing type
//     Given I open the Delivery dashboard with items missing a type
//     # Then the "Delivery" dashboard displays in view mode
//     Then the items missing type are displayed with a warning
it('View dashboard containing item that is missing type', () => {
    interceptDashboardRequest()
    cy.visit('/')
    getNavigationMenuItem('Delivery').click()

    // Check that the dashboard title is displayed
    cy.get(dashboardTitleSel).should('be.visible').and('contain', 'Delivery')

    // Check that the items are displayed with a warning
    assertItemsMissingTypeDisplayWithWarning()
})

// Scenario: Starring a dashboard fails
//     Given I open the "Delivery" dashboard
//     When clicking to star "Delivery" dashboard fails
//     Then a warning message is displayed stating that starring dashboard failed
//     And the "Delivery" dashboard is not starred
it('Starring a dashboard fails', () => {
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

// Scenario: Edit dashboard containing item that is missing type
//     Given I open the Delivery dashboard with items missing a type
//     When I choose to edit dashboard
//     Then the items missing type are displayed with a warning
//     And I can delete the items
it('Edit dashboard containing item that is missing type', () => {
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

// Scenario: Print dashboard containing item that is missing type
//     Given I open the Delivery dashboard with items missing a type
//     When I click to preview the print layout
//     Then the print layout displays for "Delivery" dashboard
//     And the items missing type are displayed with a warning
it('Print dashboard containing item that is missing type', () => {
    // open the Delivery dashboard with items missing a type
    interceptDashboardRequest()
    cy.visit('/')
    getNavigationMenuItem('Delivery').click()

    // Click to preview the print layout
    cy.getByDataTest('more-actions-button').click()
    cy.getByDataTest('print-menu-item').click()
    cy.getByDataTest('print-layout-menu-item').click()

    // Print layout displays for "Delivery" dashboard
    cy.location().should((loc) => {
        expect(loc.hash).to.equal(`${dashboards.Delivery.route}/printlayout`)
    })

    //check for some elements
    cy.getByDataTest('print-layout-page').should('be.visible')

    // Check that the items are displayed with a warning
    assertItemsMissingTypeDisplayWithWarning()
})

// Scenario: I navigate to print dashboard that doesn't exist
//     Given I type an invalid print dashboard id in the browser url
//     Then a message displays informing that the dashboard is not found
//     When I open the "Delivery" dashboard
//     Then the "Delivery" dashboard displays in view mode

// Scenario: I navigate to print layout dashboard that doesn't exist
//     Given I type an invalid print layout dashboard id in the browser url
//     Then a message displays informing that the dashboard is not found
//     When I open the "Delivery" dashboard
//     Then the "Delivery" dashboard displays in view mode

// Scenario: Item visualization fails when filter applied [DHIS2-11303]
//     Given I create a dashboard with a chart that will fail
//     When I apply a "Diagnosis" filter of type "Burns"
//     Then an error message is displayed on the item
//     When I click to preview the print layout
//     Then an error message not including a link is displayed on the item
//     When I click to exit print preview
//     And I remove the filter
//     Then the "chart" is displayed correctly

// Scenario: Item visualization fails when filter applied and viewed as table [DHIS2-11303]
//     Given I open a dashboard with a chart that will fail
//     When I apply a "Diagnosis" filter of type "Burns"
//     Then an error message is displayed on the item
//     When I view as table
//     Then an error message is displayed on the item
//     When I remove the filter
//     Then the "table" is displayed correctly

// Scenario: Item visualization fails when filter applied and viewed as table then viewed as chart [DHIS2-11303]
//     Given I open a dashboard with a chart that will fail
//     When I apply a "Diagnosis" filter of type "Burns"
//     Then an error message is displayed on the item
//     When I view as table
//     Then an error message is displayed on the item
//     When I view as chart
//     Then an error message is displayed on the item
//     When I remove the filter
//     Then the "chart" is displayed correctly

// Scenario: I delete the dashboard that was created for this test suite
//     Given I open a dashboard with a chart that will fail
//     Then I delete the created dashboard


// export const TEST_DASHBOARD_TITLE = createDashboardTitle('0ff')

// Scenario: Item visualization fails when filter applied [DHIS2-11303]

// const VIS_NAME =
//     'ANC: ANC reporting rate, coverage and visits last 4 quarters dual-axis'

// Given('I create a dashboard with a chart that will fail', () => {
//     createDashboard(TEST_DASHBOARD_TITLE, [VIS_NAME])
// })

// Given('I open a dashboard with a chart that will fail', () => {
//     cy.get(dashboardChipSel, EXTENDED_TIMEOUT)
//         .contains(TEST_DASHBOARD_TITLE)
//         .click()

//     cy.get(dashboardTitleSel)
//         .should('be.visible')
//         .and('contain', TEST_DASHBOARD_TITLE)
// })

// When(
//     'I apply a {string} filter of type {string}',
//     (dimensionType, filterName) => {
//         cy.containsExact('Filter').click()
//         cy.get(filterDimensionsPanelSel).contains(dimensionType).click()
//         cy.get(dimensionsModalSel, EXTENDED_TIMEOUT).should('be.visible')

//         cy.contains(filterName).dblclick()

//         cy.get('button').contains('Confirm').click()
//     }
// )

// Then('an error message is displayed on the item', () => {
    // FIXME
    // cy.get(`${gridItemSel}.VISUALIZATION`)
    //     .first()
    //     .contains('There was an error loading data for this item')
    //     .should('be.visible')

    // cy.get(`${gridItemSel}.VISUALIZATION`)
    //     .first()
    //     .contains('Open this item in Data Visualizer')
    //     .should('be.visible')

    // FIXME
    //    cy.get(`${gridItemSel}.VISUALIZATION`)
    //        .first()
    //        .getIframeBody()
    //        .find(chartSel)
    //        .should('not.exist')
// })

// Then('an error message not including a link is displayed on the item', () => {
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    // cy.contains('There was an error loading data for this item')
    //     .scrollIntoView()
    //     .should('be.visible')

    // cy.contains('Open this item in Data Visualizer').should('not.exist')

    // FIXME
    // cy.get(`${gridItemSel}.VISUALIZATION`)
    //     .first()
    //     .find('iframe')
    //     .should('not.exist')
})

// When('I view as chart', () => {
//     cy.get(itemMenuButtonSel).click()
//     cy.contains('View as Chart').click()
// })

// When('I view as table', () => {
//     cy.get(itemMenuButtonSel).click()
//     cy.contains('View as Pivot table').click()
// })

// When('I remove the filter', () => {
//     cy.wait(4000) // eslint-disable-line cypress/no-unnecessary-waiting
//     // eslint-disable-next-line cypress/unsafe-to-chain-command
//     cy.get(filterBadgeSel).scrollIntoView().contains('Remove').click()

//     cy.get(filterBadgeSel).should('not.exist')
//     cy.wait(4000) // eslint-disable-line cypress/no-unnecessary-waiting
// })

// FIXME
// Then('the {string} is displayed correctly', (visType) => {
//     if (visType === 'chart') {
//         cy.get(`${gridItemSel}.VISUALIZATION`)
//             .first()
//             .getIframeBody()
//             .find(chartSel)
//             .should('be.visible')
//     } else if (visType === 'table') {
//         cy.get(`${gridItemSel}.VISUALIZATION`)
//             .first()
//             .getIframeBody()
//             .find(tableSel)
//             .should('be.visible')
//     }
// })

// Then('I delete the created dashboard', () => {
//     //now cleanup
//     clickViewActionButton('Edit')
//     clickEditActionButton('Delete')
//     cy.contains(
//         `Deleting dashboard "${TEST_DASHBOARD_TITLE}" will remove it for all users`
//     ).should('be.visible')

//     cy.get(confirmActionDialogSel).find('button').contains('Delete').click()
//     cy.get(dashboardChipSel).contains(TEST_DASHBOARD_TITLE).should('not.exist')

//     cy.get(dashboardTitleSel).should('exist').should('not.be.empty')
// })

