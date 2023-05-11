import { filterBadgeSel } from '../elements/dashboardFilter.js'

export const clickOnFilterBadge = (filterName) => {
    cy.get(filterBadgeSel).find('span:visible').contains(filterName).click()
}
