import { Then } from 'cypress-cucumber-preprocessor/steps'
import {
    getDashboardItem,
    chartSubtitleSel,
    chartXAxisLabelSel,
} from '../../../elements/dashboardItem'
import {
    filterBadgeSel,
    dimensionsModalSel,
} from '../../../elements/dashboardFilter'
import { dashboards } from '../../../assets/backends'
import { EXTENDED_TIMEOUT } from '../../../support/utils'

const PERIOD = 'Last 6 months'
const OU = 'Sierra Leone'
const FACILITY_TYPE = 'Clinic'

const chartItemUid = dashboards.Delivery.items.chart.itemUid

/*
Scenario: I add a Period filter
*/

Then('the Period filter is applied to the dashboard', () => {
    cy.get(filterBadgeSel).contains(`Period: ${PERIOD}`).should('be.visible')

    getDashboardItem(chartItemUid)
        .find(chartSubtitleSel, EXTENDED_TIMEOUT)
        .scrollIntoView()
        .contains(PERIOD, EXTENDED_TIMEOUT)
        .should('be.visible')
})

/*
Scenario: I add an Organisation Unit filter
*/

Then('the Organisation Unit filter is applied to the dashboard', () => {
    cy.get(filterBadgeSel)
        .contains(`Organisation Unit: ${OU}`)
        .should('be.visible')

    getDashboardItem(chartItemUid)
        .find(chartXAxisLabelSel, EXTENDED_TIMEOUT)
        .scrollIntoView()
        .contains(OU, EXTENDED_TIMEOUT)
        .should('be.visible')
})

/*
Scenario: I add a Facility Type filter
*/
Then('the Facility Type filter is applied to the dashboard', () => {
    cy.get(filterBadgeSel)
        .contains(`Facility Type: ${FACILITY_TYPE}`)
        .should('be.visible')

    getDashboardItem(chartItemUid)
        .find(chartSubtitleSel, EXTENDED_TIMEOUT)
        .scrollIntoView()
        .contains(FACILITY_TYPE, EXTENDED_TIMEOUT)
        .should('be.visible')
})

Then('the filter modal is opened', () => {
    cy.get(dimensionsModalSel, EXTENDED_TIMEOUT).should('be.visible')
})
