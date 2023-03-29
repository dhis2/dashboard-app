import { When } from '@badeball/cypress-cucumber-preprocessor'
import { confirmActionDialogSel } from '../../../elements/editDashboard.js'

When('I confirm I want to discard changes', () => {
    cy.get(confirmActionDialogSel)
        .find('button')
        .contains('Yes, discard changes')
        .click()
})
