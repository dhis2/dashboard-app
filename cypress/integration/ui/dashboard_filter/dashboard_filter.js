import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import { getDashboardItem } from '../../../elements/dashboardItem'
import { dashboards } from '../../../assets/backends'

const OPTIONS = { timeout: 15000 }
const PERIOD = 'Last 6 months'
const OU = 'Bombali'

const chartItemUid = dashboards.Delivery.items.chart.itemUid

/*
Scenario: I add a period filter
*/

When('I add a period filter', () => {
    cy.contains('Add filter').click()

    cy.get('[data-test="undefined-button-pe"]').click()

    cy.get('[data-test="dhis2-uicore-transfer-sourceoptions"]')
        .contains(PERIOD)
        .dblclick()

    cy.get('button').contains('Confirm').click()
})

Then('the period filter is applied to the dashboard', () => {
    cy.get('[data-test="filter-badge"]')
        .contains(`Period: ${PERIOD}`)
        .should('be.visible')

    // TODO: this assertion fails on CI but passes locally
    getDashboardItem(chartItemUid)
        .find('.highcharts-subtitle', OPTIONS)
        .scrollIntoView()
        .contains(PERIOD, OPTIONS)
        .should('be.visible')
})

/*
Scenario: I add an organization unit filter
*/

When('I add an organization unit filter', () => {
    cy.contains('Add filter').click()
    cy.get('[data-test="undefined-button-ou"]').click()
    cy.get('[data-test="modal-dimension-ou"]').find('.arrow').click()
    cy.get('[data-test="modal-dimension-ou"]')
        .find('*[role="button"]')
        .contains(OU, OPTIONS)
        .click()

    cy.get('button').contains('Confirm').click()
})

Then('the organization unit filter is applied to the dashboard', () => {
    cy.get('[data-test="filter-badge"]')
        .contains(`Organisation Unit: ${OU}`)
        .should('be.visible')

    // TODO: this assertion fails on CI but passes locally
    getDashboardItem(chartItemUid)
        .find('.highcharts-xaxis-labels', OPTIONS)
        .scrollIntoView()
        .contains(OU, OPTIONS)
        .should('be.visible')
})

/*
Scenario: I add a dynamic dimension filter
*/
When('I add a dynamic dimension filter', () => {
    cy.contains('Add filter').click()

    cy.get('[data-test="dhis2-uicore-popover"]')
        .contains('Facility Type')
        .click()

    cy.get('[data-test="dhis2-uicore-transfer-sourceoptions"]')
        .contains('Clinic')
        .dblclick()

    cy.get('button').contains('Confirm').click()
})
Then('the dynamic dimension filter is applied to the dashboard', () => {
    cy.get('[data-test="filter-badge"]')
        .contains(`Facility Type: Clinic`)
        .should('be.visible')

    getDashboardItem(chartItemUid)
        .find('.highcharts-subtitle', OPTIONS)
        .scrollIntoView()
        .contains('Clinic', OPTIONS)
        .should('be.visible')
})
