import { EXTENDED_TIMEOUT } from './utils'
import { titleBarSel } from '../selectors/viewDashboard'
import { actionsBarSel } from '../selectors/editDashboard'

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
