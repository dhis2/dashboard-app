export const chartSel = '.highcharts-container'
export const mapSel = '.dhis2-map-plugin'
export const tableSel = '.pivot-table-container'
export const openInAppSel = '[data-test="link-openinapp"] a'

export const getDashboardItem = itemUid =>
    cy.get(`[data-test="dashboard-item-prog-${itemUid}"]`)

export const clickMenuButton = itemUid =>
    getDashboardItem(itemUid).find('[data-test="item-menu-button"]').click()
