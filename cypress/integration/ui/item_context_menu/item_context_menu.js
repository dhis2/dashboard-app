import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import { dashboardItem as itemEl } from '../../../elements/dashboardItem'
import { dashboards } from '../../../assets/backends'

// these tests being run on the "Delivery" dashboard
const chartItemUid = dashboards.Delivery.items.chart.uid
const tableItemUid = dashboards.Delivery.items.table.uid

When('I click View As Table on a chart dashboard item', () => {
    itemEl.action.clickMenuButton(chartItemUid)
    itemEl.action.clickViewAsTable()
})

When('I click View As Chart on a table dashboard item', () => {
    itemEl.action.clickMenuButton(tableItemUid)
    itemEl.action.clickViewAsChart()
})

When('I click View As Map on a chart dashboard item', () => {
    itemEl.action.clickMenuButton(chartItemUid)
    itemEl.action.clickViewAsMap()
})
Then('the chart dashboard item displays as a map', () => {
    itemEl.expect.mapExists(chartItemUid)
})

Then('the chart dashboard item displays as a chart', () => {
    itemEl.expect.chartExists(chartItemUid)
})

Then('the chart dashboard item displays as a table', () => {
    itemEl.expect.tableExists(chartItemUid)
})

Then('the table dashboard item displays as a chart', () => {
    itemEl.expect.chartExists(tableItemUid)
})

Then('the table dashboard item displays as a table', () => {
    itemEl.expect.tableExists(tableItemUid)
})
