const getSharingDialogUserSearch = () =>
    cy
        .getByDataTest('dhis2-uicore-sharingdialog')
        .find('[placeholder="Search"]')

export const findUser = (name) => {
    getSharingDialogUserSearch().type(name)
    cy.contains(name).should('be.visible')
    cy.getByDataTest('dhis2-uicore-menuitem').contains(name).click()
}

export const selectSharingLevel = (level) => {
    cy.getByDataTest('dhis2-uicore-sharingdialog')
        .contains('Choose a level')
        .click()

    cy.getByDataTest('dhis2-uicore-singleselectoption').contains(level).click()
    cy.get('button').contains('Give access').click()
}

export const assertSharedToUser = (name, shared) => {
    if (shared) {
        cy.getByDataTest('dhis2-uicore-sharingdialog')
            .contains('Users and groups that currently have access')
            .siblings('.list')
            .should('contain', name)
    } else {
        cy.getByDataTest('dhis2-uicore-sharingdialog')
            .contains('Users and groups that currently have access')
            .siblings('.list')
            .should('not.contain', name)
    }
}
