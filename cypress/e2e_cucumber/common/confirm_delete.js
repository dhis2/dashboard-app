import { When } from '@badeball/cypress-cucumber-preprocessor'
import { confirmActionDialogSel } from '../../elements/editDashboard.js'

When('I confirm delete', () => {
    cy.get(confirmActionDialogSel).find('button').contains('Delete').click()
})
