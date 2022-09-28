import { Then } from 'cypress-cucumber-preprocessor/steps'
import {
    filterBadgeSel,
    dimensionsModalSel,
} from '../../../elements/dashboardFilter'
import {
    gridItemSel,
    mapLegendButtonSel,
    mapLegendContentSel,
    chartSubtitleSel,
    chartXAxisLabelSel,
} from '../../../elements/dashboardItem'
import { innerScrollContainerSel } from '../../../elements/viewDashboard'
import { EXTENDED_TIMEOUT } from '../../../support/utils'

const PERIOD = 'Last 6 months'
const OU = 'Sierra Leone'
const FACILITY_TYPE = 'Clinic'

/*
Scenario: I add a Period filter
*/

Then('the Period filter is applied to the dashboard', () => {
    cy.get(filterBadgeSel).contains(`Period: ${PERIOD}`).should('be.visible')

    // check the CHART
    cy.get(`${gridItemSel}.VISUALIZATION`)
        .find(`${chartSubtitleSel} > title`, EXTENDED_TIMEOUT)
        .invoke('text')
        .then(text => {
            const commas = (text.match(/,/g) || []).length
            expect(commas).to.equal(5) // a list of 6 months has 5 commas
        })

    cy.get(innerScrollContainerSel).scrollTo('top')
    // check the MAP
    cy.get('.dhis2-map-legend-button', EXTENDED_TIMEOUT).trigger('mouseover')
    cy.get('.dhis2-map-legend-period', EXTENDED_TIMEOUT)
        .contains(PERIOD)
        .should('be.visible')
})

/*
Scenario: I add an Organisation Unit filter
*/

Then('the Organisation Unit filter is applied to the dashboard', () => {
    cy.get(filterBadgeSel)
        .contains(`Organisation Unit: ${OU}`)
        .should('be.visible')

    cy.get(innerScrollContainerSel).scrollTo('bottom')
    cy.get(`${gridItemSel}.VISUALIZATION`)
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

    cy.get(innerScrollContainerSel).scrollTo('top')
    cy.get(`${gridItemSel}.VISUALIZATION`)
        .find(chartSubtitleSel, EXTENDED_TIMEOUT)
        .scrollIntoView()
        .contains(FACILITY_TYPE, EXTENDED_TIMEOUT)
        .should('be.visible')

    cy.get(innerScrollContainerSel).scrollTo('top')
    cy.get(mapLegendButtonSel, EXTENDED_TIMEOUT).trigger('mouseover')
    cy.get(mapLegendContentSel, EXTENDED_TIMEOUT)
        .find('div')
        .contains(`Facility Type: ${FACILITY_TYPE}`)
        .should('be.visible')
})

Then('the filter modal is opened', () => {
    cy.get(dimensionsModalSel, EXTENDED_TIMEOUT).should('be.visible')
})
