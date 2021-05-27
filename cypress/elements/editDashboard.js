import { EXTENDED_TIMEOUT } from '../support/utils'

export const confirmActionDialogSel = '[data-test="confirm-action-dialog"]'
export const titleInputSel = '[data-test="dashboard-title-input"]'
export const itemMenuSel = '[data-test="item-menu]'

export const actionsBarSel = '[data-test="edit-control-bar"]'

export const clickEditActionButton = action =>
    cy
        .get(actionsBarSel, EXTENDED_TIMEOUT)
        .find('button')
        .contains(action, EXTENDED_TIMEOUT)
        .click()
