import { EXTENDED_TIMEOUT } from '../support/utils'

export const chartSel = '.highcharts-container'
export const chartSubtitleSel = '.highcharts-subtitle'
export const chartXAxisLabelSel = '.highcharts-xaxis-labels'
export const mapSel = '.dhis2-map-plugin'
export const tableSel = '.pivot-table-container'
export const gridItemSel = '.react-grid-item'

export const itemDetailsSel = '[data-test="dashboarditem-footer"]'
export const itemMenuButtonSel = '[data-test="dashboarditem-menu-button"]'

export const getDashboardItem = (itemUid) =>
    cy.get(`[data-test="dashboarditem-${itemUid}"]`, EXTENDED_TIMEOUT)

export const clickMenuButton = (itemUid) =>
    getDashboardItem(itemUid).scrollIntoView().find(itemMenuButtonSel).click()

export const clickItemDeleteButton = (itemUid) =>
    getDashboardItem(itemUid)
        .scrollIntoView()
        .find('[data-test="delete-item-button"]')
        .click()

//map

export const mapLegendButtonSel = '.dhis2-map-legend-button'
export const mapLegendContentSel = '.dhis2-map-legend-content'
