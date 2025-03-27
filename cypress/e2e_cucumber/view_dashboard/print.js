import { Then } from '@badeball/cypress-cucumber-preprocessor'
import { dashboards } from '../../assets/backends/sierraLeone_236.js'

Then('the print one-item-per-page displays for {string} dashboard', (title) => {
    //check the url
    cy.location().should((loc) => {
        expect(loc.hash).to.equal(`${dashboards[title].route}/printoipp`)
    })

    //check for some elements
    cy.get('[data-test="print-oipp-page"]').should('be.visible')
})
