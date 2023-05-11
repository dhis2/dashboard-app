import { dashboards } from '../assets/backends/sierraLeone_236.js'
import { clickViewActionButton } from '../elements/viewDashboard.js'

export const openPrintOipp = () => {
    clickViewActionButton('More')
    cy.get('[data-test="print-menu-item"]').click()
    cy.get('[data-test="print-oipp-menu-item"]').click()
}

export const printOippIsDisplayed = (title) => {
    //check the url
    cy.location().should((loc) => {
        expect(loc.hash).to.equal(`${dashboards[title].route}/printoipp`)
    })

    //check for some elements
    cy.get('[data-test="print-oipp-page"]').should('be.visible')
}
