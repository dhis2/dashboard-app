import { Given, Then } from 'cypress-cucumber-preprocessor/steps'
import { dashboards } from '../../assets/backends'
import { EXTENDED_TIMEOUT } from '../../support/utils'
import { chartSel } from '../../selectors/dashboardItem'
import { dashboardTitleSel } from '../../selectors/titleBar'
import { dashboardChipSel } from '../../selectors/dashboardsBar'

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
