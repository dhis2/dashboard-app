import { itemMenuButtonSel } from '../elements/dashboardItem.js'
import { titleInputSel, actionsBarSel } from '../elements/editDashboard.js'
import { titleBarSel, newButtonSel } from '../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT } from '../support/utils.js'

export const getViewActionButton = (action) =>
    cy
        .getBySel(titleBarSel, EXTENDED_TIMEOUT)
        .find('button')
        .contains(action, EXTENDED_TIMEOUT)

export const clickViewActionButton = (action) =>
    cy
        .getBySel(titleBarSel, EXTENDED_TIMEOUT)
        .find('button')
        .contains(action, EXTENDED_TIMEOUT)
        .click()

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

export const getDashboardItem = (itemUid) =>
    cy.getBySel(`dashboarditem-${itemUid}`, EXTENDED_TIMEOUT)

export const clickItemMenuButton = (itemUid) =>
    getDashboardItem(itemUid)
        .scrollIntoView()
        .findBySel(itemMenuButtonSel)
        .click()

export const clickItemDeleteButton = (itemUid) =>
    getDashboardItem(itemUid)
        .scrollIntoView()
        .findBySel('delete-item-button')
        .click()
