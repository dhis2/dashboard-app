import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import {
    gridItemSel,
    chartSel,
    mapSel,
} from '../../../elements/dashboardItem.js'
import { confirmActionDialogSel } from '../../../elements/editDashboard.js'
import {
    dashboardChipSel,
    dashboardTitleSel,
} from '../../../elements/viewDashboard.js'
import { getApiBaseUrl } from '../../../support/server/utils.js'
import {
    EXTENDED_TIMEOUT,
    createDashboardTitle,
} from '../../../support/utils.js'

const TEST_DASHBOARD_TITLE = createDashboardTitle('af')

const customApp = {
    name: 'Users-Role-Monitor-Widget',
    id: '5e43908a-3105-4baa-9a00-87a94ebdc034',
}

When('I add items and save', () => {
    // first install a custom app
    cy.request('POST', `${getApiBaseUrl()}/api/appHub/${customApp.id}`).then(
        (response) => {
            expect(response.status).to.eq(204)

            //add the dashboard title
            cy.get('[data-test="dashboard-title-input"]').type(
                TEST_DASHBOARD_TITLE
            )

            // open item selector
            cy.get('[data-test="item-search"]').click()
            cy.get('[data-test="item-search"]')
                .find('input')
                .type('Inpatient', { force: true })

            //CHART
            cy.get(
                '[data-test="menu-item-Inpatient: BMI this year by districts"]'
            ).click()

            cy.get('[data-test="dhis2-uicore-layer"]').click('topLeft')

            cy.get('[data-test="item-search"]').click()
            cy.get('[data-test="item-search"]')
                .find('input')
                .type('ipt 2', { force: true })

            //MAP
            cy.get(
                '[data-test="menu-item-ANC: IPT 2 Coverage this year"]'
            ).click()

            // close the item selector
            cy.get('[data-test="dhis2-uicore-layer"]').click('topLeft')

            //add a custom app item
            cy.get('[data-test="item-search"]').click()
            cy.get('[data-test="item-search"]')
                .find('input')
                .type('Role Monitor', { force: true })

            cy.contains('Role Monitor Widget').click()

            // close the item selector
            cy.get('[data-test="dhis2-uicore-layer"]').click('topLeft')

            //move things so the dashboard is more compact
            // eslint-disable-next-line cypress/unsafe-to-chain-command
            cy.get(`${gridItemSel}.MAP`)
                .trigger('mousedown')
                .trigger('mousemove', { clientX: 650 })
                .trigger('mouseup')

            //save
            cy.get('button').contains('Save changes', EXTENDED_TIMEOUT).click()
        }
    )
})

Given('I open existing dashboard', () => {
    cy.get(dashboardChipSel, EXTENDED_TIMEOUT)
        .contains(TEST_DASHBOARD_TITLE)
        .click()
})

Then('the dashboard displays in view mode', () => {
    // check for a map canvas and a highcharts element
    cy.get(chartSel, EXTENDED_TIMEOUT).should('be.visible')
    cy.get(mapSel, { timeout: 85000 }).should('be.visible')
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

    // remove the custom app
    cy.request('DELETE', `${getApiBaseUrl()}/api/apps/${customApp.name}`)
})
