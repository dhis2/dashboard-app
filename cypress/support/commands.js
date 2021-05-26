import { EXTENDED_TIMEOUT } from './utils'
import { titleBarSel } from '../selectors/viewDashboard'
import {
    actionsBarSel,
    confirmActionDialogSel,
} from '../selectors/editDashboard'

Cypress.Commands.add('clickViewActionButton', action =>
    cy
        .get(titleBarSel, EXTENDED_TIMEOUT)
        .find('button')
        .contains(action, EXTENDED_TIMEOUT)
        .click()
)

Cypress.Commands.add('clickEditActionButton', action =>
    cy
        .get(actionsBarSel, EXTENDED_TIMEOUT)
        .find('button')
        .contains(action, EXTENDED_TIMEOUT)
        .click()
)

Cypress.Commands.add('closeModal', () =>
    cy.get('[data-test="dhis2-uicore-layer"]').click('topLeft')
)

Cypress.Commands.add('cancelDeleteDashboard', () =>
    cy.get(confirmActionDialogSel).find('button').contains('Cancel').click()
)

Cypress.Commands.add('confirmDeleteDashboard', () =>
    cy.get(confirmActionDialogSel).find('button').contains('Delete').click()
)
