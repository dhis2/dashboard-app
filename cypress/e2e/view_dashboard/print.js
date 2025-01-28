import { When, Then } from '@badeball/cypress-cucumber-preprocessor'
import { dashboards } from '../../assets/backends/sierraLeone_236.js'

When('I click to preview the print one-item-per-page', () => {
    cy.get('[data-test="more-actions-button"]').click()
    cy.get('[data-test="print-menu-item"]').click()
    cy.get('[data-test="print-oipp-menu-item"]').click()
})

Then('the print one-item-per-page displays for {string} dashboard', (title) => {
    //check the url
    cy.location().should((loc) => {
        expect(loc.hash).to.equal(`${dashboards[title].route}/printoipp`)
    })

    //check for some elements
    cy.get('[data-test="print-oipp-page"]').should('be.visible')
})
