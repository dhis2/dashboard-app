import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import { dashboards } from '../../assets/backends'
import { EXTENDED_TIMEOUT } from '../../support/utils'
import { chartSel } from '../../selectors/dashboardItem'
import {
    dashboardTitleSel,
    dashboardChipSel,
    newButtonSel,
} from '../../selectors/viewDashboard'
import { titleInputSel } from '../../selectors/editDashboard'

beforeEach(() => {
    cy.visit('/', EXTENDED_TIMEOUT)
})

Given('I open the {string} dashboard', title => {
    cy.get(dashboardChipSel, EXTENDED_TIMEOUT).contains(title).click()
})

Then('the {string} dashboard displays in view mode', title => {
    cy.location().should(loc => {
        expect(loc.hash).to.equal(dashboards[title].route)
    })

    cy.get(dashboardTitleSel).should('be.visible').and('contain', title)
    cy.get(chartSel, EXTENDED_TIMEOUT).should('exist')
})

Given('I choose to create new dashboard', () => {
    cy.get(newButtonSel, EXTENDED_TIMEOUT).click()
})

When('I choose to edit dashboard', () => {
    cy.get('[data-test="link-edit-dashboard"]').click()
    cy.get(titleInputSel, EXTENDED_TIMEOUT).should('be.visible')
})

When('dashboard items are added', () => {
    cy.get('[data-test="item-search"]').click()
    cy.get('[data-test="menu-item-ANC: 1 and 3 coverage Yearly"]').click()
})
