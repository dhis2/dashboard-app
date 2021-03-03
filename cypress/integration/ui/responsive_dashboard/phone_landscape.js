import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import {
    dashboardsBarSel,
    outerScrollContainerSel,
    editControlBarSel,
} from '../../../selectors/viewDashboard'

// Scenario: Dashboards bar scrolls away in phone landscape

When('I go to phone landscape', () => {
    cy.viewport(600, 480)
    // to account for debounced window resize
    cy.wait(100) // eslint-disable-line cypress/no-unnecessary-waiting
})

When('I scroll down', () => {
    cy.get(outerScrollContainerSel).scrollTo('bottom')
    // this item is on the bottom of the Delivery dashboard
    cy.contains(
        'Births attended by skilled health personnel by orgunit last year'
    ).should('be.visible')
})

Then('the dashboards bar is not visible', () => {
    cy.get(dashboardsBarSel).should('not.be.visible')
})

When('I scroll to top', () => {
    cy.get(outerScrollContainerSel).scrollTo('top')
})

Then('the dashboards bar is visible', () => {
    cy.get(dashboardsBarSel).should('be.visible')
})

Then('the edit control bar is not visible', () => {
    cy.get(editControlBarSel).should('not.be.visible')
})

Then('the edit control bar is visible', () => {
    cy.get(editControlBarSel).should('be.visible')
})
