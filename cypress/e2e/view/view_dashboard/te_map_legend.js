import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import { dashboards } from '../../../assets/backends/sierraLeone_236.js'
import { getDashboardItem } from '../../../elements/dashboardItem.js'
import {
    dashboardTitleSel,
    dashboardChipSel,
} from '../../../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT } from '../../../support/utils.js'

const mapItemUid = dashboards['Cases Malaria'].items.map.itemUid

Given('I open the Cases Malaria dashboard', () => {
    const title = 'Cases Malaria'
    cy.get(dashboardChipSel, EXTENDED_TIMEOUT).contains(title).click()

    cy.location().should((loc) => {
        expect(loc.hash).to.equal(dashboards[title].route)
    })

    cy.get(dashboardTitleSel).should('be.visible').and('contain', title)
    // FIXME
    // cy.get(mapSel, EXTENDED_TIMEOUT).should('exist')
})

When('I hover over the map legend button', () => {
    getDashboardItem(mapItemUid)
        .find('.dhis2-map-legend-button', EXTENDED_TIMEOUT)
        .trigger('mouseover')
})

Then('the legend title shows the tracked entity name', () => {
    cy.get('.dhis2-map-legend-title')
        .contains('Malaria case registration')
        .should('be.visible')
})
