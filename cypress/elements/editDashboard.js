import { EXTENDED_TIMEOUT } from '../support/utils.js'
import { newButtonSel } from './viewDashboard.js'

export const confirmActionDialogSel = '[data-test="confirm-action-dialog"]'
export const titleInputSel = '[data-test="dashboard-title-input"]'
export const itemMenuSel = '[data-test="item-menu"]'
export const itemSearchSel = '[data-test="item-search"]'

export const actionsBarSel = '[data-test="edit-control-bar"]'

export const clickEditActionButton = (action) =>
    cy
        .get(actionsBarSel, EXTENDED_TIMEOUT)
        .find('button')
        .contains(action, EXTENDED_TIMEOUT)
        .click()

export const createDashboard = (title, items) => {
    cy.get(newButtonSel, EXTENDED_TIMEOUT).click()
    // add title
    cy.get(titleInputSel).type(title)

    // add the item
    items.forEach((itemName) => {
        cy.get('[data-test="item-search"]').click()
        cy.get('[data-test="item-search"]')
            .find('input')
            .type(itemName, { force: true })

        cy.get(`[data-test="menu-item-${itemName}"]`).click()

        cy.getByDataTest('dhis2-uicore-layer').click('topLeft')
    })

    cy.get('button').contains('Save changes', EXTENDED_TIMEOUT).click()
}

export const getRouteFromHash = (hash) => {
    const lastSlashIdx = hash.lastIndexOf('/')
    return hash.slice(lastSlashIdx + 1)
}

export const confirmEditMode = () => {
    cy.get(titleInputSel).should('exist')

    cy.location().should((loc) => {
        expect(getRouteFromHash(loc.hash)).to.eq('edit')
    })
}

export const clickEditButton = () => {
    cy.getByDataTest('title-bar', EXTENDED_TIMEOUT)
        .find('button')
        .contains('Edit', EXTENDED_TIMEOUT)
        .click()

    confirmEditMode()
}

export const addDashboardItem = (itemName) => {
    cy.getByDataTest('item-search').click()
    cy.getByDataTest('item-search')
        .find('input')
        .type(itemName, { force: true })

    cy.get(`[data-test="menu-item-${itemName}"]`).click()

    // close modal
    cy.getByDataTest('dhis2-uicore-layer').click('topLeft')
    cy.getByDataTest('item-menu').should('not.exist')
}
