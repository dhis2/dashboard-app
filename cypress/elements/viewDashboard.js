import { EXTENDED_TIMEOUT } from '../support/utils.js'

/** Selectors **/

// Dashboards bar
export const dashboardChipSel = '[data-test="dashboard-chip"]'
export const dashboardsNavMenuButtonSel =
    '[data-test="dashboards-nav-menu-button"]'
export const newButtonSel = '[data-test="new-button"]'
export const navMenuItemStarIconSel = '[data-test="starred-dashboard"]'
export const dashboardsBarSel = '[data-test="dashboards-bar"]'

// Active dashboard
export const dashboardTitleSel = '[data-test="view-dashboard-title"]'
export const dashboardDescriptionSel = '[data-test="dashboard-description"]'
export const dashboardStarredSel = '[data-test="dashboard-starred"]'
export const dashboardUnstarredSel = '[data-test="dashboard-unstarred"]'
export const titleBarSel = '[data-test="title-bar"]'

export const outerScrollContainerSel = '[data-test="outer-scroll-container"]'
export const innerScrollContainerSel = '[data-test="inner-scroll-container"]'

/** Functions **/

export const getViewActionButton = (action) =>
    cy
        .get(titleBarSel, EXTENDED_TIMEOUT)
        .find('button')
        .contains(action, EXTENDED_TIMEOUT)

export const clickViewActionButton = (action) =>
    cy
        .get(titleBarSel, EXTENDED_TIMEOUT)
        .find('button')
        .contains(action, EXTENDED_TIMEOUT)
        .click()

export const confirmViewMode = (dashboardTitle) => {
    cy.url().should('not.include', 'edit')

    if (dashboardTitle) {
        cy.get(dashboardTitleSel, EXTENDED_TIMEOUT)
            .should('be.visible')
            .and('contain', dashboardTitle)
    } else {
        cy.get(dashboardTitleSel, EXTENDED_TIMEOUT).should('be.visible')
    }
}
