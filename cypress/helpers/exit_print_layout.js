import { dashboardTitleSel } from '../elements/viewDashboard.js'

export const exitPrintLayout = () => {
    cy.get('button').not('.small').contains('Exit print preview').click()
    cy.get(dashboardTitleSel).should('be.visible')
}
