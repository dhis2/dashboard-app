import { Given, Then } from '@badeball/cypress-cucumber-preprocessor'
import { dashboards } from '../../../assets/backends/index.js'
import { EXTENDED_TIMEOUT } from '../../../support/utils.js'

Given('I open a non-editable dashboard in edit mode', () => {
    cy.intercept(`/dashboards/${dashboards.Delivery.id}`, (req) => {
        req.reply((res) => {
            const noAccessResponse = Object.assign({}, res.body, {
                access: { update: false, delete: false },
            })

            res.send(noAccessResponse)
        })
    })
    cy.visit(`${dashboards.Delivery.route}/edit`, EXTENDED_TIMEOUT)
})

Then('only the option to return to view mode is available', () => {
    cy.contains('Go to dashboards', EXTENDED_TIMEOUT).should('be.visible')
    cy.contains('No access').should('be.visible')
})
