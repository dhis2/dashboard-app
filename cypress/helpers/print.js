import { dashboards } from '../assets/backends/sierraLeone_236.js'
import { dashboardTitleSel } from '../elements/viewDashboard.js'
import { clickViewActionButton } from './dashboard.js'

export const printLayoutIsDisplayed = (title) => {
    //check the url
    cy.location().should((loc) => {
        expect(loc.hash).to.equal(`${dashboards[title].route}/printlayout`)
    })

    //check for some elements
    cy.get('[data-test="print-layout-page"]').should('be.visible')
}

export const openPrintLayout = () => {
    clickViewActionButton('More')
    cy.getBySel('print-menu-item').click()
    cy.getBySel('print-layout-menu-item').click()
}

export const exitPrintMode = () => {
    cy.get('button').not('.small').contains('Exit print preview').click()
    cy.getBySel(dashboardTitleSel).should('be.visible')
}

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
