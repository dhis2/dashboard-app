import { EXTENDED_TIMEOUT } from '../support/utils.js'
import { newButtonSel } from './viewDashboard.js'

export const confirmActionDialogSel = 'confirm-action-dialog'
export const titleInputSel = 'dashboard-title-input'
export const itemMenuSel = 'item-menu'
export const itemSearchSel = 'item-search'

export const actionsBarSel = 'edit-control-bar'

export const clickEditActionButton = (action) =>
    cy
        .getBySel(actionsBarSel, EXTENDED_TIMEOUT)
        .find('button')
        .contains(action, EXTENDED_TIMEOUT)
        .click()

export const createDashboard = (title, items) => {
    cy.getBySel(newButtonSel, EXTENDED_TIMEOUT).click()
    // add title
    cy.getBySel(titleInputSel).type(title)

    // add the item
    items.forEach((itemName) => {
        cy.getBySel('item-search').click()
        cy.getBySel('item-search').find('input').type(itemName, { force: true })

        // eslint-disable-next-line cypress/unsafe-to-chain-command
        cy.getBySel(`menu-item-${itemName}`).click().closePopper()
    })

    cy.get('button').contains('Save changes', EXTENDED_TIMEOUT).click()
}
