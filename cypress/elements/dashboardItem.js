import { EXTENDED_TIMEOUT } from '../support/utils.js'

export const chartClass = '.highcharts-container'
export const chartSubtitleClass = '.highcharts-subtitle'
export const chartXAxisLabelClass = '.highcharts-xaxis-labels'
export const mapClass = '.dhis2-map-plugin'
export const tableClass = '.pivot-table-container'
export const gridItemClass = '.react-grid-item'

export const itemDetailsSel = 'dashboarditem-footer'
export const itemMenuButtonSel = 'dashboarditem-menu-button'

export const mapLegendButtonClass = '.dhis2-map-legend-button'
export const mapLegendContentClass = '.dhis2-map-legend-content'
export const mapLegendTitleClass = '.dhis2-map-legend-title'

export const getDashboardItem = (itemUid) =>
    cy.getBySel(`dashboarditem-${itemUid}`, EXTENDED_TIMEOUT)

export const clickItemMenuButton = (itemUid) =>
    getDashboardItem(itemUid)
        .scrollIntoView()
        .findBySel(itemMenuButtonSel)
        .click()

export const clickItemDeleteButton = (itemUid) =>
    getDashboardItem(itemUid)
        .scrollIntoView()
        .findBySel('delete-item-button')
        .click()
