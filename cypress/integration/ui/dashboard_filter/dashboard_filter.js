import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import {
    getDashboardItem,
    chartSubtitleSel,
    chartXAxisLabelSel,
} from '../../../elements/dashboardItem'
import {
    dblclickDimension,
    filterDimensionsPanelSel,
    filterBadgeSel,
    checkFilterBadgeContains,
} from '../../../elements/dashboardFilter'
import { dashboards } from '../../../assets/backends'

const OPTIONS = { timeout: 15000 }
const PERIOD = 'Last 6 months'
const OU = 'Sierra Leone'
const FACILITY_TYPE = 'Clinic'

const chartItemUid = dashboards.Delivery.items.chart.itemUid

When('I add a {string} filter', dimensionType => {
    cy.contains('Add filter').click()

    cy.get(filterDimensionsPanelSel).contains(dimensionType).click()
    if (dimensionType === 'Period') {
        dblclickDimension(PERIOD)
    } else if (dimensionType === 'Organisation Unit') {
        dblclickDimension(OU, 'ou')
    } else {
        dblclickDimension(FACILITY_TYPE)
    }

    cy.get('button').contains('Confirm').click()
})

/*
Scenario: I add a Period filter
*/

Then('the Period filter is applied to the dashboard', () => {
    checkFilterBadgeContains(`Period: ${PERIOD}`)

    // TODO: this assertion fails on CI but passes locally
    getDashboardItem(chartItemUid)
        .find(chartSubtitleSel, OPTIONS)
        .scrollIntoView()
        .contains(PERIOD, OPTIONS)
        .should('be.visible')
})

/*
Scenario: I add an Organisation Unit filter
*/

Then('the Organisation Unit filter is applied to the dashboard', () => {
    cy.get(filterBadgeSel)
        .contains(`Organisation Unit: ${OU}`)
        .should('be.visible')

    // TODO: this assertion fails on CI but passes locally
    getDashboardItem(chartItemUid)
        .find(chartXAxisLabelSel, OPTIONS)
        .scrollIntoView()
        .contains(OU, OPTIONS)
        .should('be.visible')
})

/*
Scenario: I add a Facility Type filter
*/
Then('the Facility Type filter is applied to the dashboard', () => {
    checkFilterBadgeContains(`Facility Type: ${FACILITY_TYPE}`)

    getDashboardItem(chartItemUid)
        .find(chartSubtitleSel, OPTIONS)
        .scrollIntoView()
        .contains(FACILITY_TYPE, OPTIONS)
        .should('be.visible')
})
