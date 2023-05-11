import { filterBadgeSel } from '../elements/dashboardFilter.js'

export const clickOnFilterBadge = (filterName) => {
    cy.getBySel(filterBadgeSel)
        .find('span:visible')
        .contains(filterName)
        .click()
}
