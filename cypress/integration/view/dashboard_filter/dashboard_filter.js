import { Then } from 'cypress-cucumber-preprocessor/steps'
import {
    filterBadgeSel,
    dimensionsModalSel,
} from '../../../elements/dashboardFilter.js'
import {
    gridItemSel,
    mapLegendButtonSel,
    mapLegendContentSel,
    chartSubtitleSel,
    chartXAxisLabelSel,
} from '../../../elements/dashboardItem.js'
import { innerScrollContainerSel } from '../../../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT } from '../../../support/utils.js'

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
        .then((text) => {
            const commas = (text.match(/,/g) || []).length
            expect(commas).to.equal(5) // a list of 6 months has 5 commas
        })

    cy.get(innerScrollContainerSel).scrollTo('top')
    // check the MAP
    // TODO - restore the normal EXTENDED_TIMEOUT when
    // slow loading of this map has been fixes
    // https://dhis2.atlassian.net/browse/DHIS2-14365
    cy.get('.dhis2-map-legend-button', { timeout: 85000 }).trigger('mouseover')
    cy.get('.dhis2-map-legend-period', EXTENDED_TIMEOUT)
        .contains(PERIOD)
        .should('be.visible')
})

/*
Scenario: I add an Organisation unit filter
*/

Then('the Organisation unit filter is applied to the dashboard', () => {
    cy.get(filterBadgeSel)
        .contains(`Organisation unit: ${OU}`)
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
    // TODO - restore the normal EXTENDED_TIMEOUT when
    // slow loading of this map has been fixes
    // https://dhis2.atlassian.net/browse/DHIS2-14365
    cy.get(mapLegendButtonSel, { timeout: 85000 }).trigger('mouseover')
    cy.get(mapLegendContentSel, EXTENDED_TIMEOUT)
        .find('div')
        .contains(`Facility Type: ${FACILITY_TYPE}`)
        .should('be.visible')
})

Then('the filter modal is opened', () => {
    cy.get(dimensionsModalSel, EXTENDED_TIMEOUT).should('be.visible')
})
