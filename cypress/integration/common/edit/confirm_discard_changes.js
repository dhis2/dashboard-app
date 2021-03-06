import { When } from 'cypress-cucumber-preprocessor/steps'
import { confirmActionDialogSel } from '../../../elements/editDashboard'

When('I confirm I want to discard changes', () => {
    cy.get(confirmActionDialogSel)
        .find('button')
        .contains('Yes, discard changes')
        .click()
})
