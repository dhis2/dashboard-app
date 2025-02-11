import { Given } from '@badeball/cypress-cucumber-preprocessor'
import { dashboards } from '../../assets/backends/index.js'
import { getNavigationMenuItem } from '../../elements/navigationMenu.js'

Given('I open the {string} dashboard with shapes removed', (title) => {
    const regex = new RegExp(`dashboards/${dashboards[title].id}`, 'g')
    cy.intercept(regex, (req) => {
        req.reply((res) => {
            res.body.dashboardItems.forEach((item) => {
                delete item.x
                delete item.y
                delete item.w
                delete item.h
            })

            res.send({ body: res.body })
        })
    })
    getNavigationMenuItem(title).click()
})
