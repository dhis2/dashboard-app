import { When, Then } from '@badeball/cypress-cucumber-preprocessor'
import {
    getDashboardItem,
    clickMenuButton,
} from '../../elements/dashboardItem.js'

const sortedDashboardItemIds = ['GaVhJpqABYX', 'qXsjttMYuoZ', 'Rwb3oXJ3bZ9']

const assertItemIsVisible = (slideshowItemIndex) => {
    getDashboardItem(sortedDashboardItemIds[slideshowItemIndex]).should(
        'have.css',
        'opacity',
        '1'
    )
}

const assertItemIsNotVisible = (slideshowItemIndex) => {
    getDashboardItem(sortedDashboardItemIds[slideshowItemIndex]).should(
        'have.css',
        'opacity',
        '0'
    )
}

const getSlideshowExitButton = () =>
    cy.getByDataTest('slideshow-exit-button', { timeout: 15000 })

When('I click the slideshow button', () => {
    cy.get('button').contains('Slideshow').realClick()
})

Then('item 1 is shown in fullscreen', () => {
    getSlideshowExitButton().should('be.visible')

    // check that only the first item is shown
    assertItemIsVisible(0)
    assertItemIsNotVisible(1)
    assertItemIsNotVisible(2)

    cy.getByDataTest('slideshow-page-counter').should('have.text', '1 / 11')

    // visible item does not have context menu button
    getDashboardItem(sortedDashboardItemIds[0])
        .findByDataTest('dashboarditem-menu-button')
        .should('not.exist')
})

When('I click the exit slideshow button', () => {
    getSlideshowExitButton().realClick()
})

Then('the normal view is shown', () => {
    getSlideshowExitButton().should('not.exist')

    // check that multiple items are shown
    assertItemIsVisible(0)
    assertItemIsVisible(1)
    assertItemIsVisible(2)

    // items have context menu button
    getDashboardItem(sortedDashboardItemIds[0])
        .findByDataTest('dashboarditem-menu-button')
        .should('be.visible')

    getDashboardItem(sortedDashboardItemIds[1])
        .findByDataTest('dashboarditem-menu-button')
        .should('be.visible')
})

// When I click the next slide button
When('I click the next slide button', () => {
    cy.getByDataTest('slideshow-next-button').realClick()
})

Then('item 2 is shown in fullscreen', () => {
    assertItemIsNotVisible(0)
    assertItemIsVisible(1)
    assertItemIsNotVisible(2)

    cy.getByDataTest('slideshow-page-counter').should('have.text', '2 / 11')
})

When('I click the previous slide button', () => {
    cy.getByDataTest('slideshow-prev-button').realClick()
})

When('I click the fullscreen button on the second item', () => {
    clickMenuButton(sortedDashboardItemIds[1])
    cy.contains('View fullscreen').realClick()
})

When('I click the fullscreen button on the third item', () => {
    clickMenuButton(sortedDashboardItemIds[2])
    cy.contains('View fullscreen').realClick()
})

Then('item 3 is shown in fullscreen', () => {
    assertItemIsNotVisible(0)
    assertItemIsNotVisible(1)
    assertItemIsVisible(2)

    cy.getByDataTest('slideshow-page-counter').should('have.text', '3 / 11')
})
