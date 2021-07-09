import { Given } from 'cypress-cucumber-preprocessor/steps'
import { dashboards } from '../../../assets/backends'
import { dashboardChipSel } from '../../../elements/viewDashboard'
import { EXTENDED_TIMEOUT } from '../../../support/utils'

Given('I open the {string} dashboard with shapes removed', title => {
    const regex = new RegExp(`dashboards/${dashboards[title].id}`, 'g')
    cy.intercept(regex, req => {
        req.reply(res => {
            res.body.dashboardItems.forEach(item => {
                delete item.x
                delete item.y
                delete item.w
                delete item.h
            })

            res.send({ body: res.body })
        })
    })
    cy.get(dashboardChipSel, EXTENDED_TIMEOUT).contains(title).click()
})
