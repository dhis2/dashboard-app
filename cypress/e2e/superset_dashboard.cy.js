import { newButtonSel } from '../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT } from '../support/utils.js'

const SUPERSET_BASE_URL = 'https://superset-test.dhis2.org'
const NAME = 'My new dashboard'
const NAME_UPDATED = 'My updated dashboard'
const CODE = 'MY_CODE'
const DESCRIPTION = 'My dashboard description text'
const DESCRIPTION_UPATED = 'My updated dashboard description'
const UUID = '2e5ae28f-60d1-4fb9-a609-5bd4586bf4ac'
const UUID_UPDATED = '418b4581-3c2a-43a9-8561-9725eadcaffd'
const SUPERSET_DASHBOARD_STUB = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Superset dashboard stub</title>
  </head>
  <body>
    <h1>Superset dashboard stub</h1>
  </body>
</html>
`

const getInputByLabelText = (labelText, inputTag = 'input') =>
    cy.get('form').contains('label', labelText).parent().find(inputTag)

describe('Creating, viewing, editing and deleting an embedded superset dashboard', function () {
    before(function () {
        // Skip this test if the DHIS2 Core version is below 42
        const versionString = Cypress.env('dhis2InstanceVersion')
        expect(typeof versionString).to.equal('string')
        expect(versionString).to.equal('2.41')
        expect(typeof versionString.split).to.equal('function')
        const version = parseInt(
            // Support both '2.41' and '41'
            Cypress.env('dhis2InstanceVersion').split('.').pop()
        )
        if (version < 42) {
            this.skip()
        }
    })

    beforeEach(() => {
        // Fake support for embedded dashboards by intercepting the requests below
        cy.intercept('**', (req) => {
            if (req.url.includes('/systemSettings?')) {
                // Append system setting for embedded dashboard support
                req.continue((resp) => {
                    resp.body.keyEmbeddedDashboardsEnabled = true
                    return resp
                })
            } else if (req.url.includes('/superset-gateway/api/info')) {
                // Stub the response to the superset gateway info request
                req.reply({
                    supersetBaseUrl: SUPERSET_BASE_URL,
                    apiDocsPath:
                        '/superset-gateway/apidocs/dhis2-superset-gateway/swagger-ui/',
                })
            } else if (
                req.url.includes(
                    '/superset-gateway/api/guestTokens/dhis2/dashboards/'
                )
            ) {
                // Stub the response to the superset gatewat guest token request
                req.reply({
                    // Note that the string below does need to have a particular pattern: it was
                    // copied from the network tab and cannot be replaced by a random shorter string.
                    // The superset embed SDK must do some sort of pattern validation on it
                    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiYW5hbHl0aWNzIiwiZmlyc3RfbmFtZSI6IkRISVMgMiBTdXBlcnNldCIsImxhc3RfbmFtZSI6IkdhdGV3YXkifSwicmVzb3VyY2VzIjpbeyJ0eXBlIjoiZGFzaGJvYXJkIiwiaWQiOiI2NmEzNGMyYS1mYTA2LTRkYjUtYmQ2ZS0wOGZkMjRiZjVhY2MifV0sInJsc19ydWxlcyI6W10sImlhdCI6MTczNzk5NTE0My4yMTU5NjcsImV4cCI6MTczNzk5NTQ0My4yMTU5NjcsImF1ZCI6Imh0dHA6Ly8wLjAuMC4wOjgwODAvIiwidHlwZSI6Imd1ZXN0In0.AayCHirBjomllKxThOCQsn4RHoIfaXfULOVtcnylhj8',
                })
            } else if (req.url.includes(`${SUPERSET_BASE_URL}/embedded/`)) {
                req.reply(SUPERSET_DASHBOARD_STUB)
            } else {
                // Just return the response by default
                req.continue((resp) => resp)
            }
        })
    })

    it('creates an embedded superset dashboard', () => {
        // Start a new dashboard from the start page
        cy.visit('#/start')

        cy.get(newButtonSel, EXTENDED_TIMEOUT).click()

        // Choose the embedded dashboard option
        cy.contains('External').should('be.visible').click()

        // Click the configure source button
        cy.contains('Continue').should('be.visible').click()

        // A modal form to create a new embedded dashboard is showing
        cy.contains('New dashboard: external').should('be.visible')

        // Check all initial values and change them
        getInputByLabelText('Title').should('have.value', '').type(NAME)
        getInputByLabelText('Code').should('have.value', '').type(CODE)
        getInputByLabelText('Description', 'textarea')
            .should('have.value', '')
            .type(DESCRIPTION)
        getInputByLabelText('Superset Embed ID')
            .should('have.value', '')
            .type(UUID)
        getInputByLabelText('Show chart controls on dashboard items')
            .should('be.checked')
            .uncheck()
        getInputByLabelText('Expand filters').should('not.be.checked').check()

        // Click the create button
        cy.contains('Save dashboard').should('be.enabled').click()

        cy.contains('h3', NAME).should('be.visible')
        cy.contains('External source').should('be.visible')
        // An iframe should be visible with the UUID in the src
        cy.get('iframe')
            .should('be.visible')
            .and('have.attr', 'src')
            .and('contain', UUID)

        // some options are disabled
        // Primary actions
        cy.contains('button', 'Slideshow').should('be.disabled')
        cy.contains('button', 'Filter').should('be.disabled')
        // Actions in the more-menu
        cy.getByDataTest('more-actions-button').should('be.enabled').click()
        cy.contains('a', 'Make available offline').should(
            'have.attr',
            'aria-disabled',
            'true'
        )
        cy.contains('a', 'Print')
            .should('have.attr', 'aria-disabled', 'true')
            .and('have.attr', 'aria-expanded', 'false')
        // Close the menu by clicking the backdrop
        cy.get('.backdrop').should('be.visible').click()
    })

    it('shows and hides the description', () => {
        cy.getByDataTest('more-actions-button').should('be.enabled').click()
        cy.contains('a', 'Show description').should('be.visible').click()
        cy.contains(DESCRIPTION).should('be.visible')
        cy.getByDataTest('more-actions-button').should('be.enabled').click()
        cy.contains('a', 'Hide description').should('be.visible').click()
        cy.contains(DESCRIPTION_UPATED).should('not.exist')
    })

    it('stars and unstars the superset embedded dashboard', () => {
        // Can be starred via menu bar
        cy.getByDataTest('dashboard-unstarred').click()
        cy.getByDataTest('dashboard-starred').should('be.visible')
        // And unstarred via ...menu
        cy.getByDataTest('more-actions-button').should('be.enabled').click()
        cy.contains('a', 'Unstar dashboard').should('be.visible').click()
        cy.getByDataTest('dashboard-unstarred').should('be.visible')
    })

    it('can open the sharing dialog', () => {
        cy.contains('button', 'Share').should('be.enabled').click()
        cy.contains('h1', `Sharing and access: ${NAME}`).should('be.visible')
        // We don't test the actual sharing, just if the sharing modal pops up
        cy.contains('button', 'Close').should('be.enabled').click()
    })

    it('edits the superset embedded dashboard', () => {
        cy.contains('button', 'Edit').should('be.enabled').click()
        cy.contains('Edit external dashboard').should('be.visible')
        // Check all initial values are as when created and change some of them
        getInputByLabelText('Title')
            .should('have.value', NAME)
            .clear()
            .type(NAME_UPDATED)
        getInputByLabelText('Code').should('have.value', CODE)
        getInputByLabelText('Description', 'textarea')
            .should('have.value', DESCRIPTION)
            .clear()
            .type(DESCRIPTION_UPATED)
        getInputByLabelText('Superset Embed ID')
            .should('have.value', UUID)
            .clear()
            .type(UUID_UPDATED)
        getInputByLabelText('Show chart controls on dashboard items').should(
            'not.be.checked'
        )
        getInputByLabelText('Expand filters').should('be.checked')

        // Click the update button
        cy.contains('Save dashboard').should('be.enabled').click()

        cy.contains('h3', NAME_UPDATED).should('be.visible')
        cy.contains('External source').should('be.visible')

        // First show the description
        cy.getByDataTest('more-actions-button').should('be.enabled').click()
        cy.contains('a', 'Show description').should('be.visible').click()
        // Ensure it is showing the updated description
        cy.contains(DESCRIPTION_UPATED).should('be.visible')

        // An iframe should be visible with the UUID in the src
        cy.get('iframe')
            .should('be.visible')
            .and('have.attr', 'src')
            .and('contain', UUID_UPDATED)
    })

    it('hides the description', () => {
        cy.getByDataTest('more-actions-button').should('be.enabled').click()
        cy.contains('a', 'Hide description').should('be.visible').click()
        cy.contains(DESCRIPTION_UPATED).should('not.exist')
    })

    it('deletes the new superset embedded dashboard', () => {
        cy.contains('Edit').should('be.enabled').click()
        cy.contains('Edit external dashboard').should('be.visible')
        cy.contains('button', 'Delete dashboard').should('be.enabled').click()
        cy.contains('h1', 'Delete dashboard').should('be.visible')
        cy.contains('button', 'Delete').should('be.enabled').click()
        cy.url().should('satisfy', (href) => href.endsWith('/#/'))
    })
})
