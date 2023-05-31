import { dashboards } from '../assets/backends/index.js'
import { dashboardChipSel } from '../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT } from '../support/utils.js'

// TODO - not currently in use
export const openDashboardWithoutShapes = (title) => {
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
    cy.getBySel(dashboardChipSel, EXTENDED_TIMEOUT).contains(title).click()
}