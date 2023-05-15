import { filterBadgeSel } from '../elements/dashboardFilter.js'
import {
    gridItemClass,
    mapLegendButtonClass,
    mapLegendContentClass,
    chartSubtitleClass,
    chartXAxisLabelClass,
} from '../elements/dashboardItem.js'
import { innerScrollContainerSel } from '../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT } from '../support/utils.js'

const PERIOD = 'Last 6 months'
const OU = 'Sierra Leone'
const FACILITY_TYPE = 'Clinic'

export const clickOnFilterBadge = (filterName) => {
    cy.getBySel(filterBadgeSel)
        .find('span:visible')
        .contains(filterName)
        .click()
}

export const expectPeriodFilterToBeApplied = () => {
    cy.getBySel(filterBadgeSel)
        .contains(`Period: ${PERIOD}`)
        .should('be.visible')

    // check the CHART
    // FIXME
    cy.get(`${gridItemClass}.VISUALIZATION`)
        .getIframeBody()
        .find(`${chartSubtitleClass} > title`, EXTENDED_TIMEOUT)
        .invoke('text')
        .then((text) => {
            const commas = (text.match(/,/g) || []).length
            expect(commas).to.equal(5) // a list of 6 months has 5 commas
        })

    cy.getBySel(innerScrollContainerSel).scrollTo('top')
    // check the MAP
    // TODO - restore the normal EXTENDED_TIMEOUT when
    // slow loading of this map has been fixes
    // https://dhis2.atlassian.net/browse/DHIS2-14365
    // FIXME
    cy.get(`${gridItemClass}.MAP`)
        .getIframeBody()
        .find(mapLegendButtonClass, { timeout: 85000 })
        .trigger('mouseover')
    cy.get(`${gridItemClass}.MAP`)
        .getIframeBody()
        .find(mapLegendContentClass, EXTENDED_TIMEOUT)
        .contains(PERIOD)
        .should('be.visible')
}

export const expectOrganisationUnitFilterToBeApplied = () => {
    cy.getBySel(filterBadgeSel)
        .contains(`Organisation unit: ${OU}`)
        .should('be.visible')

    cy.getBySel(innerScrollContainerSel).scrollTo('bottom')
    // FIXME
    cy.get(`${gridItemClass}.VISUALIZATION`)
        .getIframeBody()
        .find(chartXAxisLabelClass, EXTENDED_TIMEOUT)
        .scrollIntoView()
        .contains(OU, EXTENDED_TIMEOUT)
        .should('be.visible')
}

export const expectFacilityTypeFilterToBeApplied = () => {
    cy.getBySel(filterBadgeSel)
        .contains(`Facility Type: ${FACILITY_TYPE}`)
        .should('be.visible')

    cy.getBySel(innerScrollContainerSel).scrollTo('top')
    // FIXME
    cy.get(`${gridItemClass}.VISUALIZATION`)
        .getIframeBody()
        .find(chartSubtitleClass, EXTENDED_TIMEOUT)
        .scrollIntoView()
        .contains(FACILITY_TYPE, EXTENDED_TIMEOUT)
        .should('be.visible')

    cy.getBySel(innerScrollContainerSel).scrollTo('top')
    // TODO - restore the normal EXTENDED_TIMEOUT when
    // slow loading of this map has been fixes
    // https://dhis2.atlassian.net/browse/DHIS2-14365
    cy.get(`${gridItemClass}.MAP`)
        .getIframeBody()
        .find(mapLegendButtonClass, { timeout: 85000 })
        .trigger('mouseover')
    cy.get(`${gridItemClass}.MAP`)
        .getIframeBody()
        .find(mapLegendContentClass, EXTENDED_TIMEOUT)
        .find('div')
        .contains(`Facility Type: ${FACILITY_TYPE}`)
        .should('be.visible')
}
