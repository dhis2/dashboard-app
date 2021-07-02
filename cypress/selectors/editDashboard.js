import { EXTENDED_TIMEOUT } from '../support/utils'
import { newDashboardLinkSel } from './viewDashboard'

export const titleInputSel = '[data-test="dashboard-title-input"]'
export const itemMenuSel = '[data-test="item-menu]'

export const actionsBarSel = '[data-test="edit-control-bar"]'

export const clickEditActionButton = action =>
    cy
        .get(actionsBarSel, EXTENDED_TIMEOUT)
        .find('button')
        .contains(action, EXTENDED_TIMEOUT)
        .click()

export const createDashboard = (title, items) => {
    cy.get(newDashboardLinkSel, EXTENDED_TIMEOUT).click()
    // add title
    cy.get(titleInputSel).type(title)

    // add the item
    items.forEach(itemName => {
        cy.get('[data-test="item-search"]').click()
        cy.get('[data-test="item-search"]')
            .find('input')
            .type(itemName, { force: true })

        cy.get(`[data-test="menu-item-${itemName}"]`).click()

        cy.get('[data-test="dhis2-uicore-layer"]').click('topLeft')
    })

    cy.get('button').contains('Save changes', EXTENDED_TIMEOUT).click()
}
