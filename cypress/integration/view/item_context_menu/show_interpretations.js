import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import { dashboards } from '../../../assets/backends/index.js'
import {
    itemDetailsSel,
    clickMenuButton,
    getDashboardItem,
} from '../../../elements/dashboardItem.js'

// these tests being run on the "Delivery" dashboard
const chartItemUid = dashboards.Delivery.items.chart.itemUid

/*
Scenario: Open the interpretations panel
*/

When(
    'I click Show details and interpretations on a chart dashboard item',
    () => {
        clickMenuButton(chartItemUid)
        cy.contains('Show details and interpretations').click()
    }
)
Then('the interpretations panel is displayed', () => {
    getDashboardItem(chartItemUid)
        .find(itemDetailsSel)
        .contains('About this')
        .scrollIntoView()
        .should('be.visible')

    getDashboardItem(chartItemUid)
        .find(itemDetailsSel)
        .contains('Interpretations')
        .scrollIntoView()
        .should('be.visible')
})
