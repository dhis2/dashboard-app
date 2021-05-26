import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import {
    dashboardsBarSel,
    outerScrollContainerSel,
} from '../../../selectors/viewDashboard'
import { actionsBarSel } from '../../../selectors/editDashboard'
import { EXTENDED_TIMEOUT } from '../../../support/utils'

// Scenario: Dashboards bar scrolls away in phone landscape

When('I go to phone landscape', () => {
    cy.viewport(600, 480)
    // to account for debounced window resize
    cy.wait(100) // eslint-disable-line cypress/no-unnecessary-waiting
})

When('I scroll down', () => {
    cy.get(outerScrollContainerSel, EXTENDED_TIMEOUT).scrollTo('bottom')
    // this item is on the bottom of the Delivery dashboard
    cy.contains(
        'Births attended by skilled health personnel by orgunit last year',
        EXTENDED_TIMEOUT
    ).should('be.visible')
})

Then('the dashboards bar is not visible', () => {
    cy.get(dashboardsBarSel, EXTENDED_TIMEOUT).should('not.be.visible')
})

When('I scroll to top', () => {
    cy.get(outerScrollContainerSel).scrollTo('top')
})

Then('the dashboards bar is visible', () => {
    cy.get(dashboardsBarSel).should('be.visible')
})

Then('the edit control bar is not visible', () => {
    cy.get(actionsBarSel, EXTENDED_TIMEOUT).should('not.be.visible')
})

Then('the edit control bar is visible', () => {
    cy.get(actionsBarSel).should('be.visible')
})
