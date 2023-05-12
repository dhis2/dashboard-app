import { actionsBarSel } from '../elements/editDashboard.js'
import {
    dashboardsBarSel,
    outerScrollContainerSel,
} from '../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT } from '../support/utils.js'

export const goToPhoneLandscape = () => {
    cy.viewport(600, 480)
    // to account for debounced window resize
    cy.wait(100) // eslint-disable-line cypress/no-unnecessary-waiting
}

export const scrollDown = () => {
    cy.getBySel(outerScrollContainerSel, EXTENDED_TIMEOUT).scrollTo('bottom')
    // this item is on the bottom of the Delivery dashboard
    cy.contains(
        'Births attended by skilled health personnel by orgunit last year',
        EXTENDED_TIMEOUT
    ).should('be.visible')
}

export const expectDashboardsBarNotVisible = () => {
    cy.getBySel(dashboardsBarSel, EXTENDED_TIMEOUT).should('not.be.visible')
}

export const scrollToTop = () => {
    cy.getBySel(outerScrollContainerSel).scrollTo('top')
}

export const expectDashboardsBarVisible = () => {
    cy.getBySel(dashboardsBarSel).should('be.visible')
}

export const expectEditControlBarNotVisible = () => {
    cy.getBySel(actionsBarSel, EXTENDED_TIMEOUT).should('not.be.visible')
}

export const expectEditControlBarVisible = () => {
    cy.getBySel(actionsBarSel).should('be.visible')
}
