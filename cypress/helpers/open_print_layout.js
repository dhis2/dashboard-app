import { clickViewActionButton } from '../elements/viewDashboard.js'

export const openPrintLayout = () => {
    clickViewActionButton('More')
    cy.get('[data-test="print-menu-item"]').click()
    cy.get('[data-test="print-layout-menu-item"]').click()
}
