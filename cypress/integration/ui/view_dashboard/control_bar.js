import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import { EXTENDED_TIMEOUT } from '../../../support/utils'
import { getApiBaseUrl } from '../../../support/server/utils'
import {
    dragHandleSel,
    dashboardsBarSel,
    dashboardTitleSel,
    dashboardsBarContainerSel,
} from '../../../selectors/viewDashboard'

const MIN_DASHBOARDS_BAR_HEIGHT = 71
const MAX_DASHBOARDS_BAR_HEIGHT = 431

beforeEach(() => {
    cy.request({
        method: 'PUT',
        url: `${getApiBaseUrl()}/api/userDataStore/dashboard/controlBarRows`,
        headers: {
            'content-type': 'application/json',
        },
        body: '1',
    }).then(response => expect(response.status).to.equal(201))
})

When('I toggle the control bar height', () => {
    cy.get('[data-test="showmore-button"]').click()
})

Given('I type an invalid dashboard id in the browser url', () => {
    cy.visit('#/invalid', EXTENDED_TIMEOUT)
})

Then('a message displays informing that the dashboard is not found', () => {
    cy.contains('Requested dashboard not found').should('be.visible')
    cy.get(dashboardTitleSel).should('not.exist')
})
Then('the control bar should be at collapsed height', () => {
    cy.get(dashboardsBarContainerSel, EXTENDED_TIMEOUT)
        .invoke('height')
        .should('eq', MIN_DASHBOARDS_BAR_HEIGHT)
})

Then('the control bar should be expanded to full height', () => {
    cy.get(dashboardsBarContainerSel, EXTENDED_TIMEOUT)
        .invoke('height')
        .should('eq', MAX_DASHBOARDS_BAR_HEIGHT)
})

// Scenario: I change the height of the control bar
When('I drag to increase the height of the control bar', () => {
    cy.intercept('PUT', '/userDataStore/dashboard/controlBarRows').as('putRows')
    cy.get(dragHandleSel, EXTENDED_TIMEOUT)
        .trigger('mousedown')
        .trigger('mousemove', { clientY: 300 })
        .trigger('mouseup')

    cy.wait('@putRows').its('response.statusCode').should('eq', 201)
})

Then('the control bar height should be updated', () => {
    cy.visit('/')
    cy.get(dashboardsBarSel, EXTENDED_TIMEOUT)
        .invoke('height')
        .should('eq', 231)

    // restore the original height
    cy.get(dragHandleSel)
        .trigger('mousedown')
        .trigger('mousemove', { clientY: MIN_DASHBOARDS_BAR_HEIGHT })
        .trigger('mouseup')
    cy.wait('@putRows').its('response.statusCode').should('eq', 201)
})

When('I drag to decrease the height of the control bar', () => {
    cy.intercept('PUT', '/userDataStore/dashboard/controlBarRows').as('putRows')
    cy.get(dragHandleSel, EXTENDED_TIMEOUT)
        .trigger('mousedown')
        .trigger('mousemove', { clientY: 300 })
        .trigger('mouseup')

    cy.wait('@putRows').its('response.statusCode').should('eq', 201)
})
