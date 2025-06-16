import { Then } from '@badeball/cypress-cucumber-preprocessor'
import { dashboards } from '../../assets/backends/index.js'
import {
    getDashboardItem,
    itemMenuButtonSel,
    clickMenuButton,
} from '../../elements/dashboardItem.js'

Then('the text item does not have a context menu', () => {
    getDashboardItem(dashboards['Antenatal Care'].items.text.itemUid)
        .find(itemMenuButtonSel)
        .should('not.exist')
})

Then('the chart item has a fullscreen option in the context menu', () => {
    clickMenuButton(dashboards['Antenatal Care'].items.chart.itemUid)
    cy.contains('View fullscreen').should('be.visible')
})
