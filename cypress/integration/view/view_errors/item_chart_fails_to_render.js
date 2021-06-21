import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { EXTENDED_TIMEOUT } from '../../../support/utils'
import {
    clickViewActionButton,
    dashboardChipSel,
    dashboardTitleSel,
} from '../../../elements/viewDashboard'
import {
    clickEditActionButton,
    confirmActionDialogSel,
    createDashboard,
} from '../../../elements/editDashboard'
import {
    dimensionsModalSel,
    filterDimensionsPanelSel,
    filterBadgeSel,
} from '../../../elements/dashboardFilter'
import {
    chartSel,
    tableSel,
    itemMenuButtonSel,
} from '../../../elements/dashboardItem'

const TEST_DASHBOARD_TITLE = '0filter-fail-' + new Date().toUTCString()

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
        cy.contains('Add filter').click()
        cy.get(filterDimensionsPanelSel).contains(dimensionType).click()
        cy.get(dimensionsModalSel, EXTENDED_TIMEOUT).should('be.visible')

        cy.contains(filterName).dblclick()

        cy.get('button').contains('Confirm').click()
    }
)

Then('an error message is displayed on the item', () => {
    cy.contains('There was an error loading data for this item').should(
        'be.visible'
    )

    cy.contains('Open this item in Data Visualizer').should('be.visible')

    cy.get(chartSel).should('not.exist')
})

Then('an error message not including a link is displayed on the item', () => {
    cy.contains('There was an error loading data for this item')
        .scrollIntoView()
        .should('be.visible')

    cy.contains('Open this item in Data Visualizer').should('not.exist')

    cy.get(chartSel).should('not.exist')
})

When('I view as chart', () => {
    cy.get(itemMenuButtonSel).click()
    cy.contains('View as Chart').click()
})

When('I view as table', () => {
    cy.get(itemMenuButtonSel).click()
    cy.contains('View as Table').click()
})

When('I remove the filter', () => {
    cy.get(filterBadgeSel).scrollIntoView().contains('Remove').click()

    cy.get(filterBadgeSel).should('not.exist')
})

Then('the {string} is displayed correctly', visType => {
    if (visType === 'chart') {
        cy.get(chartSel, EXTENDED_TIMEOUT).should('be.visible')
    } else if (visType === 'table') {
        cy.get(tableSel, EXTENDED_TIMEOUT).should('be.visible')
    }

    //TODO - add snapshot testing
})

Then('I delete the dashboard', () => {
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
