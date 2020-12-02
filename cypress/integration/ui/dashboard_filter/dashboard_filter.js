import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import {
    getDashboardItem,
    chartSubtitleSel,
    chartXAxisLabelSel,
} from '../../../selectors/dashboardItem'
import {
    unselectedItemsSel,
    filterDimensionsPanelSel,
    filterBadgeSel,
    orgUnitHierarchySel,
    orgUnitCheckboxesSel,
} from '../../../selectors/dashboardFilter'
import { dashboards } from '../../../assets/backends'
import { EXTENDED_TIMEOUT } from '../../../support/utils'

const PERIOD = 'Last 6 months'
const OU = 'Sierra Leone'
const FACILITY_TYPE = 'Clinic'

const chartItemUid = dashboards.Delivery.items.chart.itemUid

When('I add a {string} filter', dimensionType => {
    cy.contains('Add filter').click()

    // open the dimensions modal
    cy.get(filterDimensionsPanelSel).contains(dimensionType).click()

    // select an item in the modal
    if (dimensionType === 'Period') {
        cy.get(unselectedItemsSel).contains(PERIOD).dblclick()
    } else if (dimensionType === 'Organisation Unit') {
        cy.get(orgUnitHierarchySel, EXTENDED_TIMEOUT).find('.arrow').click()
        cy.get(orgUnitHierarchySel, EXTENDED_TIMEOUT)
            .find(orgUnitCheckboxesSel, EXTENDED_TIMEOUT)
            .contains(OU, EXTENDED_TIMEOUT)
            .click()
    } else {
        cy.get(unselectedItemsSel).contains(FACILITY_TYPE).dblclick()
    }

    // confirm to apply the filter
    cy.get('button').contains('Confirm').click()
})

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
