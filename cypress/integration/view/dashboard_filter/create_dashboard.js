import {
    gridItemSel,
    // chartSel,
    // mapSel,
} from '../../../elements/dashboardItem.js'

import {
    dashboardChipSel,
    dashboardTitleSel,
} from '../../../elements/viewDashboard.js'
import {
    EXTENDED_TIMEOUT,
    createDashboardTitle,
} from '../../../support/utils.js'

const TEST_DASHBOARD_TITLE = createDashboardTitle('af')

// When('I add a MAP and a CHART and save', () => {
export const addMapAndChart = () => {
    //add the title
    cy.get('[data-test="dashboard-title-input"]').type(TEST_DASHBOARD_TITLE)

    // add items
    cy.get('[data-test="item-search"]').click()
    cy.get('[data-test="item-search"]')
        .find('input')
        .type('Inpatient', { force: true })

    //chart
    cy.get(
        '[data-test="menu-item-Inpatient: BMI this year by districts"]'
    ).click()

    cy.get('[data-test="dhis2-uicore-layer"]').click('topLeft')

    cy.get('[data-test="item-search"]').click()
    cy.get('[data-test="item-search"]')
        .find('input')
        .type('ipt 2', { force: true })

    //map
    cy.get('[data-test="menu-item-ANC: IPT 2 Coverage this year"]').click()

    cy.get('[data-test="dhis2-uicore-layer"]').click('topLeft')

    //move things so the dashboard is more compact
    cy.get(`${gridItemSel}.MAP`)
        .trigger('mousedown')
        .trigger('mousemove', { clientX: 650 })
        .trigger('mouseup')

    //save
    cy.get('button').contains('Save changes', EXTENDED_TIMEOUT).click()
}

// Given('I open existing dashboard', () => {
export const openCreatedDashboard = () => {
    cy.get(dashboardChipSel, EXTENDED_TIMEOUT)
        .contains(TEST_DASHBOARD_TITLE)
        .click()
}

// Some map visualization load very slowly:
// https://dhis2.atlassian.net/browse/DHIS2-14365
// Then('the dashboard displays in view mode', () => {
export const dashboardDisplaysInViewMode = () => {
    cy.get(dashboardTitleSel)
        .should('be.visible')
        .and('contain', TEST_DASHBOARD_TITLE)
    // check for a map canvas and a highcharts element
    // FIXME
    // cy.get(chartSel, EXTENDED_TIMEOUT).should('be.visible')
    // cy.get(mapSel, EXTENDED_TIMEOUT).should('be.visible')
}

// Then('different dashboard displays in view mode', () => {
export const differentDashboardDisplayed = () => {
    cy.get(dashboardTitleSel)
        .should('be.visible')
        .and('not.contain', TEST_DASHBOARD_TITLE)
}
