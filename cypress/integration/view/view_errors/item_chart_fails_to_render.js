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
import { chartSel } from '../../../elements/dashboardItem'

const TEST_DASHBOARD_TITLE = 'filter-fail-' + new Date().toUTCString()

// Scenario: Item visualization fails when filter applied [DHIS2-11303]

Given('I create a dashboard with a chart that will fail', () => {
    createDashboard(TEST_DASHBOARD_TITLE, [
        'ANC: ANC reporting rate, coverage and visits last 4 quarters dual-axis',
    ])
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

    cy.get(chartSel).should('not.exist')
})

When('I remove the filter', () => {
    cy.get(filterBadgeSel).contains('Remove').click()
})

Then('the visualization is displayed correctly', () => {
    cy.get(chartSel).should('be.visible')

    //TODO - add snapshot testing

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
