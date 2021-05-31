import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import { dashboards } from '../../../assets/backends/sierraLeone_236'
import { clickViewActionButton } from '../../../elements/viewDashboard'

When('I click to preview the print layout', () => {
    clickViewActionButton('More')
    cy.get('[data-test="print-menu-item"]').click()
    cy.get('[data-test="print-layout-menu-item"]').click()
})

Then('the print layout displays for {string} dashboard', title => {
    //check the url
    cy.location().should(loc => {
        expect(loc.hash).to.equal(`${dashboards[title].route}/printlayout`)
    })

    //check for some elements
    cy.get('[data-test="print-layout-page"]').should('be.visible')
})

When('I click to exit print preview', () => {
    cy.get('button').not('.small').contains('Exit print preview').click()
})

When('I click to preview the print one-item-per-page', () => {
    clickViewActionButton('More')
    cy.get('[data-test="print-menu-item"]').click()
    cy.get('[data-test="print-oipp-menu-item"]').click()
})

Then('the print one-item-per-page displays for {string} dashboard', title => {
    //check the url
    cy.location().should(loc => {
        expect(loc.hash).to.equal(`${dashboards[title].route}/printoipp`)
    })

    //check for some elements
    cy.get('[data-test="print-oipp-page"]').should('be.visible')
})
