import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import { dashboardItem as itemEl } from '../../../elements/dashboardItem'
import { dashboards } from '../../../assets/backends'

// these tests being run on the "Delivery" dashboard
const itemData = dashboards.Delivery.items

When('I click View As Table on a chart dashboard item', () => {
    itemEl.action.clickMenuButton(itemData.chart.uid)
    itemEl.action.clickViewAsTable()
})

When('I click View As Chart on a table dashboard item', () => {
    itemEl.action.clickMenuButton(itemData.table.uid)
    itemEl.action.clickViewAsChart()
})

When('I click View As Map on a chart dashboard item', () => {
    itemEl.action.clickMenuButton(itemData.chart.uid)
    itemEl.action.clickViewAsMap()
})
Then('the chart dashboard item displays as a map', () => {
    itemEl.expect.mapExists(itemData.chart.uid)
})

Then('the chart dashboard item displays as a chart', () => {
    itemEl.expect.chartExists(itemData.chart.uid)
})

Then('the chart dashboard item displays as a table', () => {
    itemEl.expect.tableExists(itemData.chart.uid)
})

Then('the table dashboard item displays as a chart', () => {
    itemEl.expect.chartExists(itemData.table.uid)
})

Then('the table dashboard item displays as a table', () => {
    itemEl.expect.tableExists(itemData.table.uid)
})
