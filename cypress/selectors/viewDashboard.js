import { EXTENDED_TIMEOUT } from '../support/utils'

// Dashboards bar
export const dashboardChipSel = '[data-test="dashboard-chip"]'
export const newDashboardLinkSel = '[data-test="link-new-dashboard"]'
export const chipStarSel = '[data-test="dhis2-uicore-chip-icon"]'
export const dashboardSearchInputSel =
    'input:visible[placeholder="Search for a dashboard"]'

// Active dashboard
export const dashboardTitleSel = '[data-test="view-dashboard-title"]'
export const dashboardDescriptionSel = '[data-test="dashboard-description"]'
export const starSel = '[data-test="button-star-dashboard"]'
export const dashboardStarredSel = '[data-test="dashboard-starred"]'
export const dashboardUnstarredSel = '[data-test="dashboard-unstarred"]'
export const titleBarSel = '[data-test="title-bar"]'

export const dragHandleSel = '[data-test="controlbar-drag-handle"]'
export const dashboardsBarSel = '[data-test="dashboards-bar"]'
export const dashboardsBarContainerSel = '[data-test="dashboardsbar-container"]'

export const outerScrollContainerSel = '[data-test="outer-scroll-container"]'
export const innerScrollContainerSel = '[data-test="inner-scroll-container"]'

export const editControlBarSel = '[data-test="edit-control-bar"]'

export const clickViewActionButton = action =>
    cy
        .get(titleBarSel, EXTENDED_TIMEOUT)
        .find('button')
        .contains(action, EXTENDED_TIMEOUT)
        .click()