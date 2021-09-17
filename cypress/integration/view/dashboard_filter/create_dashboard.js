import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import { gridItemSel, chartSel, mapSel } from '../../../elements/dashboardItem'
import { confirmActionDialogSel } from '../../../elements/editDashboard'
import {
    dashboardChipSel,
    dashboardTitleSel,
} from '../../../elements/viewDashboard'
import { EXTENDED_TIMEOUT } from '../../../support/utils'

const TEST_DASHBOARD_TITLE = 'a filter ' + new Date().toUTCString()

When('I add a MAP and a CHART and save', () => {
    //add the title
    cy.get('[data-test="dashboard-title-input"]').type(TEST_DASHBOARD_TITLE)

    // add items
    cy.get('[data-test="item-search"]').click()
    cy.get('[data-test="item-search"]')
        .find('input')
        .type('Inpatient', { force: true })

    // //chart
    cy.get(
        '[data-test="menu-item-Inpatient: BMI this year by districts"]'
    ).click()

    //map
    cy.get(
        '[data-test="menu-item-Inpatient: BMI at facility level this year"]'
    ).click()

    cy.get('[data-test="dhis2-uicore-layer"]').click('topLeft')

    //move things so the dashboard is more compact
    cy.get(`${gridItemSel}.MAP`)
        .trigger('mousedown')
        .trigger('mousemove', { clientX: 600 })
        .trigger('mouseup')

    //save
    cy.get('button').contains('Save changes', EXTENDED_TIMEOUT).click()
})

Given('I open existing dashboard', () => {
    cy.get(dashboardChipSel, EXTENDED_TIMEOUT)
        .contains(TEST_DASHBOARD_TITLE)
        .click()
})

Then('the dashboard displays in view mode', () => {
    // check for a map canvas and a highcharts element
    cy.get(chartSel, EXTENDED_TIMEOUT).should('be.visible')
    cy.get(mapSel, EXTENDED_TIMEOUT).should('be.visible')
})

When('I choose to delete dashboard', () => {
    cy.get('[data-test="delete-dashboard-button"]').click()
})

When('I confirm delete', () => {
    cy.get(confirmActionDialogSel).find('button').contains('Delete').click()
})

Then('different dashboard displays in view mode', () => {
    cy.get(dashboardTitleSel)
        .should('be.visible')
        .and('not.contain', TEST_DASHBOARD_TITLE)
})
