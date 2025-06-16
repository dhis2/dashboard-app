import { When, Then } from '@badeball/cypress-cucumber-preprocessor'
import { titleInputSel } from '../../elements/editDashboard.js'
import { titleBarSel } from '../../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT } from '../../support/utils.js'

const ROUTE_EDIT = 'edit'

const getRouteFromHash = (hash) => {
    const lastSlashIdx = hash.lastIndexOf('/')
    return hash.slice(lastSlashIdx + 1)
}

const confirmEditMode = () => {
    cy.get(titleInputSel).should('exist')

    cy.location().should((loc) => {
        expect(getRouteFromHash(loc.hash)).to.eq(ROUTE_EDIT)
    })
}

When('I choose to edit dashboard', () => {
    cy.get(titleBarSel, EXTENDED_TIMEOUT)
        .find('button')
        .contains('Edit', EXTENDED_TIMEOUT)
        .click()

    confirmEditMode()
})

Then('the dashboard displays in edit mode', () => {
    confirmEditMode()
})
