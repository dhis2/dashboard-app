import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor'
import {
    dimensionsModalSel,
    filterDimensionsPanelSel,
    filterBadgeSel,
} from '../../elements/dashboardFilter.js'
import { gridItemSel, itemMenuButtonSel } from '../../elements/dashboardItem.js'
import {
    clickEditActionButton,
    confirmActionDialogSel,
    createDashboard,
} from '../../elements/editDashboard.js'
import {
    clickViewActionButton,
    dashboardChipSel,
    dashboardTitleSel,
} from '../../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT, createDashboardTitle } from '../../support/utils.js'

export const TEST_DASHBOARD_TITLE = createDashboardTitle('0ff')

// Scenario: Item visualization fails when filter applied [DHIS2-11303]

const VIS_NAME =
    'ANC: ANC reporting rate, coverage and visits last 4 quarters dual-axis'

Given('I create a dashboard with a chart that will fail', () => {
    createDashboard(TEST_DASHBOARD_TITLE, [VIS_NAME])
})

Given('I open a dashboard with a chart that will fail', () => {
    cy.get(dashboardChipSel, EXTENDED_TIMEOUT)
        .contains(TEST_DASHBOARD_TITLE)
        .click()

    cy.get(dashboardTitleSel)
        .should('be.visible')
        .and('contain', TEST_DASHBOARD_TITLE)
})

When(
    'I apply a {string} filter of type {string}',
    (dimensionType, filterName) => {
        cy.contains('Filter').click()
        cy.get(filterDimensionsPanelSel).contains(dimensionType).click()
        cy.get(dimensionsModalSel, EXTENDED_TIMEOUT).should('be.visible')

        cy.contains(filterName).dblclick()

        cy.get('button').contains('Confirm').click()
    }
)

Then('an error message is displayed on the item', () => {
    // FIXME
    // cy.get(`${gridItemSel}.VISUALIZATION`)
    //     .first()
    //     .contains('There was an error loading data for this item')
    //     .should('be.visible')

    cy.get(`${gridItemSel}.VISUALIZATION`)
        .first()
        .contains('Open this item in Data Visualizer')
        .should('be.visible')

    // FIXME
    //    cy.get(`${gridItemSel}.VISUALIZATION`)
    //        .first()
    //        .getIframeBody()
    //        .find(chartSel)
    //        .should('not.exist')
})

Then('an error message not including a link is displayed on the item', () => {
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.contains('There was an error loading data for this item')
        .scrollIntoView()
        .should('be.visible')

    cy.contains('Open this item in Data Visualizer').should('not.exist')

    // FIXME
    // cy.get(`${gridItemSel}.VISUALIZATION`)
    //     .first()
    //     .find('iframe')
    //     .should('not.exist')
})

When('I view as chart', () => {
    cy.get(itemMenuButtonSel).click()
    cy.contains('View as Chart').click()
})

When('I view as table', () => {
    cy.get(itemMenuButtonSel).click()
    cy.contains('View as Pivot table').click()
})

When('I remove the filter', () => {
    cy.wait(4000) // eslint-disable-line cypress/no-unnecessary-waiting
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get(filterBadgeSel).scrollIntoView().contains('Remove').click()

    cy.get(filterBadgeSel).should('not.exist')
    cy.wait(4000) // eslint-disable-line cypress/no-unnecessary-waiting
})

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

Then('I delete the created dashboard', () => {
    //now cleanup
    clickViewActionButton('Edit')
    clickEditActionButton('Delete')
    cy.contains(
        `Deleting dashboard "${TEST_DASHBOARD_TITLE}" will remove it for all users`
    ).should('be.visible')

    cy.get(confirmActionDialogSel).find('button').contains('Delete').click()
    cy.get(dashboardChipSel).contains(TEST_DASHBOARD_TITLE).should('not.exist')

    cy.get(dashboardTitleSel).should('exist').should('not.be.empty')
})
