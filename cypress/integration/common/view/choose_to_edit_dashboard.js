import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import { EXTENDED_TIMEOUT } from '../../../support/utils'
import { titleInputSel } from '../../../selectors/editDashboard'
import { titleBarSel } from '../../../selectors/viewDashboard'

const ROUTE_EDIT = 'edit'

const confirmEditMode = () => {
    cy.get(titleInputSel).should('exist')

    cy.location().should(loc => {
        expect(getRouteFromHash(loc.hash)).to.eq(ROUTE_EDIT)
    })
}

const getRouteFromHash = hash => {
    const lastSlashIdx = hash.lastIndexOf('/')
    return hash.slice(lastSlashIdx + 1)
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
