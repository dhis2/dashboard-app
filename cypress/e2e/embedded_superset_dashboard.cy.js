import { newButtonSel } from '../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT } from '../support/utils.js'

const SUPERSET_BASE_URL = 'https://superset-test.dhis2.org'
const UUID = '2e5ae28f-60d1-4fb9-a609-5bd4586bf4ac'
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

describe(
    ['>=42'],
    'Creating, viewing, editing and deleting an embedded superset dashboard',
    () => {
        before(() => {
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

        it('is possible to create an embedded superset dashboard', () => {
            // Start a new dashboard from the start page
            cy.visit('#/start')
            cy.get(newButtonSel, EXTENDED_TIMEOUT).click()

            // Choose the embedded dashboard option
            cy.contains('External: Data from another source')
                .should('be.visible')
                .click()

            // Click the configure source button
            cy.contains('Configure source').should('be.visible').click()

            // A modal form to create a new embedded dashboard is showing
            cy.contains(
                'New dashboard: configure external source (superset)'
            ).should('be.visible')

            // All text fields are empty and both checkboxes are checked
            getInputByLabelText('Title').should('have.value', '')
            getInputByLabelText('Code').should('have.value', '')
            getInputByLabelText('Description', 'textarea').should(
                'have.value',
                ''
            )
            getInputByLabelText('Superset Embed ID').should('have.value', '')
            getInputByLabelText(
                'Show chart controls on dashboard items'
            ).should('have.prop', 'checked')
            getInputByLabelText('Show filters').should('have.prop', 'checked')

            // Fill in the title and superset ID fields
            getInputByLabelText('Title').type('My new dashboard ')
            // getInputByLabelText('Code').type('MY_CODE')
            getInputByLabelText('Description', 'textarea').type(
                'My dashboard description'
            )
            getInputByLabelText('Superset Embed ID').type(UUID)

            // Click the create button
            cy.contains('Save dashboard').should('be.enabled').click()

            // An iframe should be visible with the UUID in the src
            cy.get('iframe')
                .should('be.visible')
                .and('have.attr', 'src')
                .and('contain', UUID)
        })
    }
)
