import { EXTENDED_TIMEOUT } from './utils'
import { titleBarSel } from '../selectors/viewDashboard'
import { actionsBarSel } from '../selectors/editDashboard'

Cypress.Commands.add('clickMoreButton', () =>
    cy
        .get(titleBarSel, EXTENDED_TIMEOUT)
        .find('button')
        .contains('More', EXTENDED_TIMEOUT)
        .click()
)

Cypress.Commands.add('clickSaveChanges', () =>
    cy
        .get(actionsBarSel, EXTENDED_TIMEOUT)
        .find('button')
        .contains('Save changes', EXTENDED_TIMEOUT)
        .click()
)
