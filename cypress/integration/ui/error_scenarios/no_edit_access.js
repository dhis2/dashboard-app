import { Given, Then } from 'cypress-cucumber-preprocessor/steps'
import { EXTENDED_TIMEOUT } from '../../../support/utils'
import { dashboards } from '../../../assets/backends'

Given('I open a non-editable dashboard in edit mode', () => {
    cy.intercept(`/dashboards/${dashboards.Delivery.id}`, req => {
        req.reply(res => {
            const noAccessResponse = Object.assign({}, res.body, {
                access: { update: false, delete: false },
            })

            res.send(noAccessResponse)
        })
    })
    cy.visit(`${dashboards.Delivery.route}/edit`, EXTENDED_TIMEOUT)
})

Then('only the option to return to view mode is available', () => {
    cy.contains('Go to dashboards').should('be.visible')
    cy.contains('No access').should('be.visible')
})
