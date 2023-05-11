import { actionsBarSel } from '../../elements/editDashboard.js'
import {
    dashboardsBarSel,
    outerScrollContainerSel,
} from '../../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT } from '../../support/utils.js'

// Scenario: Dashboards bar scrolls away in phone landscape

// When('I go to phone landscape', () => {
export const goToPhoneLandscape = () => {
    cy.viewport(600, 480)
    // to account for debounced window resize
    cy.wait(100) // eslint-disable-line cypress/no-unnecessary-waiting
}

// When('I scroll down', () => {
export const scrollDown = () => {
    cy.get(outerScrollContainerSel, EXTENDED_TIMEOUT).scrollTo('bottom')
    // this item is on the bottom of the Delivery dashboard
    cy.contains(
        'Births attended by skilled health personnel by orgunit last year',
        EXTENDED_TIMEOUT
    ).should('be.visible')
}

// Then('the dashboards bar is not visible', () => {
export const expectDashboardsBarNotVisible = () => {
    cy.get(dashboardsBarSel, EXTENDED_TIMEOUT).should('not.be.visible')
}

// When('I scroll to top', () => {
export const scrollToTop = () => {
    cy.get(outerScrollContainerSel).scrollTo('top')
}

// Then('the dashboards bar is visible', () => {
export const expectDashboardsBarVisible = () => {
    cy.get(dashboardsBarSel).should('be.visible')
}

// Then('the edit control bar is not visible', () => {
export const expectEditControlBarNotVisible = () => {
    cy.get(actionsBarSel, EXTENDED_TIMEOUT).should('not.be.visible')
}

// Then('the edit control bar is visible', () => {
export const expectEditControlBarVisible = () => {
    cy.get(actionsBarSel).should('be.visible')
}
