export const chartSel = '.highcharts-container'
export const chartSubtitleSel = '.highcharts-subtitle'
export const chartXAxisLabelSel = '.highcharts-xaxis-labels'
export const mapSel = '.dhis2-map-plugin'
export const tableSel = '.pivot-table-container'
export const gridItemSel = '.react-grid-item'

export const itemDetailsSel = '[data-test="dashboarditem-footer"]'
export const itemMenuButton = '[data-test="dashboarditem-menu-button"]'

export const getDashboardItem = itemUid =>
    cy.get(`[data-test="dashboarditem-${itemUid}"]`)

export const clickMenuButton = itemUid =>
    getDashboardItem(itemUid).find(itemMenuButton).click()
