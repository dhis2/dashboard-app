import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import {
    itemContextMenu,
    expectChartToExist,
    expectTableToExist,
    expectChartToNotExist,
    expectTableToNotExist,
    expectMapToExist,
} from '../../elements/dashboardItem'

const DASHBOARD_ITEM_CHART_UID = 'GaVhJpqABYX'
const DASHBOARD_ITEM_TABLE_UID = 'qXsjttMYuoZ'
// const DASHBOARD_ITEM_MAP_UID = 'G3EtzSWNP9o'

When('I click View As Table on a chart dashboard item', () => {
    itemContextMenu.clickContextMenu(DASHBOARD_ITEM_CHART_UID)
    itemContextMenu.clickViewAsTable(DASHBOARD_ITEM_CHART_UID)
})

When('I click View As Chart on a table dashboard item', () => {
    itemContextMenu.clickContextMenu(DASHBOARD_ITEM_TABLE_UID)
    itemContextMenu.clickViewAsChart(DASHBOARD_ITEM_TABLE_UID)
})

When('I click View As Map on a chart dashboard item', () => {
    itemContextMenu.clickContextMenu(DASHBOARD_ITEM_CHART_UID)
    itemContextMenu.clickViewAsMap()
})
Then('the chart dashboard item displays as a map', () => {
    expectChartToNotExist(DASHBOARD_ITEM_CHART_UID)
    expectMapToExist(DASHBOARD_ITEM_CHART_UID)
})

Then('the chart dashboard item displays as a chart', () => {
    expectChartToExist(DASHBOARD_ITEM_CHART_UID)
    expectTableToNotExist(DASHBOARD_ITEM_CHART_UID)
})

Then('the chart dashboard item displays as a table', () => {
    expectChartToNotExist(DASHBOARD_ITEM_CHART_UID)
    expectTableToExist(DASHBOARD_ITEM_CHART_UID)
})

Then('the table dashboard item displays as a chart', () => {
    expectChartToExist(DASHBOARD_ITEM_TABLE_UID)
    expectTableToNotExist(DASHBOARD_ITEM_TABLE_UID)
})

Then('the table dashboard item displays as a table', () => {
    expectChartToNotExist(DASHBOARD_ITEM_TABLE_UID)
    expectTableToExist(DASHBOARD_ITEM_TABLE_UID)
})
