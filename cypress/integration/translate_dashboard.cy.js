import {
    clickEditActionButton,
    dashboardTitleSel,
    clickViewActionButton,
    newButtonSel,
    getNavigationMenuItem,
    confirmActionDialogSel,
} from '../elements/index.js'
import { EXTENDED_TIMEOUT, createDashboardTitle } from '../support/utils.js'

const deleteDashboard = (dashboardTitle) => {
    clickEditActionButton('Delete')

    cy.contains(
        `Deleting dashboard "${dashboardTitle}" will remove it for all users`
    ).should('be.visible')
    cy.get(confirmActionDialogSel).find('button').contains('Delete').click()
    cy.url().should('not.include', 'edit')

    // Confirm different dashboard is shown in view mode
    getNavigationMenuItem(dashboardTitle).should('not.exist')
    cy.get(dashboardTitleSel)
        .should('be.visible')
        .and('not.contain', dashboardTitle)
}

it('adds translations', () => {
    // Create a dashboard
    cy.visit('/')
    const TEST_DASHBOARD_TITLE = createDashboardTitle('e2e-translate')
    cy.get(newButtonSel, EXTENDED_TIMEOUT).click()
    cy.getByDataTest('dashboard-title-input').type(TEST_DASHBOARD_TITLE)
    cy.getByDataTest('dashboard-description-input').type(
        TEST_DASHBOARD_TITLE + ' description'
    )

    // Save the dashboard
    clickEditActionButton('Save changes')
    cy.get(dashboardTitleSel, EXTENDED_TIMEOUT)
        .should('be.visible')
        .and('contain', TEST_DASHBOARD_TITLE)

    // Edit the dashboard
    clickViewActionButton('Edit')

    // Add translations for dashboard name and description in Norwegian
    clickEditActionButton('Translate')
    cy.getByDataTest('dhis2-uicore-select-input').click()
    cy.getByDataTest('dhis2-uicore-select-menu-menuwrapper')
        .find('div')
        .contains('nor', { matchCase: false })
        .click()

    const norwegianTitle = 'nor title'
    const norwegianDesc = 'nor desc'

    cy.getByDataTest('dhis2-analytics-translation-modal')
        .find('textarea')
        .eq(1)
        .clear()
    cy.getByDataTest('dhis2-analytics-translation-modal')
        .find('textarea')
        .eq(1)
        .type(norwegianTitle)
    cy.getByDataTest('dhis2-analytics-translation-modal')
        .find('textarea')
        .last()
        .clear()
    cy.getByDataTest('dhis2-analytics-translation-modal')
        .find('textarea')
        .last()
        .type(norwegianDesc)

    cy.intercept('PUT', '**/dashboards/*/translations', (req) => {
        // Assert the payload structure
        expect(req.body).to.have.property('translations')
        expect(req.body.translations).to.be.an('array')
        expect(req.body.translations).to.have.length(2)

        // Assert NAME translation
        const nameTranslation = req.body.translations.find(
            (t) => t.property === 'NAME'
        )
        expect(nameTranslation).to.exist
        expect(nameTranslation.locale).to.equal('no')
        expect(nameTranslation.value).to.contain('nor title')

        // Assert DESCRIPTION translation
        const descTranslation = req.body.translations.find(
            (t) => t.property === 'DESCRIPTION'
        )
        expect(descTranslation).to.exist
        expect(descTranslation.locale).to.equal('no')
        expect(descTranslation.value).to.contain('nor desc')

        req.reply((res) => {
            expect(res.statusCode).to.equal(204)
            return res
        })
    }).as('addTranslations')

    cy.get('button').contains('Save translations', EXTENDED_TIMEOUT).click()

    cy.wait('@addTranslations')

    deleteDashboard(TEST_DASHBOARD_TITLE)
})
