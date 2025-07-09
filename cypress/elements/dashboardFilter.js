import { EXTENDED_TIMEOUT } from '../support/utils.js'

export const filterBadgeSel = '[data-test="dashboard-filter-badge"]'

export const filterBadgeDeleteBtnSel = '[data-test="filter-badge-clear-button"]'

export const filterDimensionsPanelSel = '[data-test="dashboard-filter-popover"]'

export const unselectedItemsSel =
    '[data-test*="dimension-transfer-sourceoptions"]'

export const orgUnitTreeSel = '[data-test="org-unit-tree"]'

export const dimensionsModalSel = '[data-test="dimension-modal"]'

const PERIOD = 'Last 6 months'
const OU = 'Sierra Leone'
const FACILITY_TYPE = 'Clinic'
const OU_ID = 'ImspTQPwCqd' //Sierra Leone

export const addFilter = (dimensionType) => {
    cy.containsExact('Filter').click()

    // select an item in the modal
    switch (dimensionType) {
        case 'Period':
            cy.get(filterDimensionsPanelSel).contains(dimensionType).click()
            cy.get(unselectedItemsSel).contains(PERIOD).dblclick()
            break
        case 'Organisation unit':
            cy.get(filterDimensionsPanelSel).contains(dimensionType).click()
            cy.get(orgUnitTreeSel, EXTENDED_TIMEOUT)
                .find('[type="checkbox"]', EXTENDED_TIMEOUT)
                .check(OU_ID)
            break
        case 'Org unit group':
            cy.get(filterDimensionsPanelSel)
                .contains('Organisation unit')
                .click()
            cy.getByDataTest('org-unit-group-select').click()
            cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
                .contains('District')
                .click()
            // close the popup
            cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
                .closest('[data-test="dhis2-uicore-layer"]')
                .click('topLeft')
            break

        default:
            cy.get(filterDimensionsPanelSel).contains(dimensionType).click()
            cy.get(unselectedItemsSel).contains(FACILITY_TYPE).dblclick()
    }

    // confirm to apply the filter
    cy.get('button').contains('Confirm').click()
}

export const assertPeriodFilterApplied = () => {
    cy.get(filterBadgeSel).contains(`Period: ${PERIOD}`).should('be.visible')

    // check the CHART
    // cy.get(`${gridItemSel}.VISUALIZATION`).getIframeBody().as('iframeBody')
    // cy.get('@iframeBody')
    //     .find(`${chartSubtitleSel} > title`, EXTENDED_TIMEOUT)
    //     .invoke('text')
    //     .then((text) => {
    //         const commas = (text.match(/,/g) || []).length
    //         expect(commas).to.equal(5) // a list of 6 months has 5 commas
    //     })

    // cy.get(innerScrollContainerSel).scrollTo('top')
    // // check the MAP
    // // TODO - restore the normal EXTENDED_TIMEOUT when
    // // slow loading of this map has been fixes
    // // https://dhis2.atlassian.net/browse/DHIS2-14365
    // cy.get(`${gridItemSel}.MAP`).getIframeBody().as('iframeBodyMap')
    // cy.get('@iframeBodyMap')
    //     .find('.dhis2-map-legend-button', { timeout: 85000 })
    //     .trigger('mouseover')
    // cy.get(`${gridItemSel}.MAP`).getIframeBody().as('iframeBodyMap2')
    // cy.get('@iframeBodyMap2')
    //     .find('.dhis2-map-legend-period', EXTENDED_TIMEOUT)
    //     .contains(PERIOD)
    //     .should('be.visible')
}

export const assertOrgUnitFilterApplied = () => {
    cy.get(filterBadgeSel)
        .contains(`Organisation unit: ${OU}`)
        .should('be.visible')

    // cy.get(innerScrollContainerSel).scrollTo('bottom')
    // cy.get(`${gridItemSel}.VISUALIZATION`).getIframeBody().as('iframeBody')
    // cy.get('@iframeBody')
    //     .find(chartXAxisLabelSel, EXTENDED_TIMEOUT)
    //     .as('chartXAxisLabelSel')
    //     .scrollIntoView()

    // cy.get('@chartXAxisLabelSel')
    //     .contains(OU, EXTENDED_TIMEOUT)
    //     .should('be.visible')
}

export const assertFacilityTypeFilterApplied = () => {
    cy.get(filterBadgeSel)
        .contains(`Facility Type: ${FACILITY_TYPE}`)
        .should('be.visible')

    // cy.get(innerScrollContainerSel).scrollTo('top')
    // cy.get(`${gridItemSel}.VISUALIZATION`).getIframeBody().as('iframeBody')
    // cy.get('@iframeBody')
    //     .find(chartSubtitleSel, EXTENDED_TIMEOUT)
    //     .as('chartSubtitleSel')
    //     .scrollIntoView()

    // cy.get('@chartSubtitleSel')
    //     .contains(FACILITY_TYPE, EXTENDED_TIMEOUT)
    //     .should('be.visible')

    // cy.get(innerScrollContainerSel).scrollTo('top')
    // // TODO - restore the normal EXTENDED_TIMEOUT when
    // // slow loading of this map has been fixes
    // // https://dhis2.atlassian.net/browse/DHIS2-14365
    // cy.get(`${gridItemSel}.MAP`)
    //     .getIframeBody()
    //     .find(mapLegendButtonSel, { timeout: 85000 })
    //     .trigger('mouseover')
    // cy.get(`${gridItemSel}.MAP`)
    //     .getIframeBody()
    //     .find(mapLegendContentSel, EXTENDED_TIMEOUT)
    //     .find('div')
    //     .contains(`Facility Type: ${FACILITY_TYPE}`)
    //     .should('be.visible')
}

export const assertOrgUnitGroupFilterApplied = () => {
    // check that the filter badge is correct
    cy.get(filterBadgeSel)
        .contains('Organisation unit: District')
        .should('be.visible')

    // check that the custom app is loaded (see ticket DHIS2-14544)
    cy.get('iframe')
        .invoke('attr', 'title')
        .contains('Role Monitor Widget')
        .scrollIntoView()
    cy.get('iframe')
        .invoke('attr', 'title')
        .contains('Role Monitor Widget')
        .should('be.visible')
}

export const assertFilterModalOpened = () => {
    cy.get(dimensionsModalSel).should('be.visible')
}

export const removeFilter = () => {
    cy.get(filterBadgeDeleteBtnSel).click()
}

export const assertFilterRemoved = () => {
    cy.get(filterBadgeSel).should('not.exist')
}
