import { dashboards } from '../assets/backends/sierraLeone_236.js'
import {
    clickMenuButton,
    getDashboardItem,
    confirmViewMode,
} from '../elements/index.js'
import { EXTENDED_TIMEOUT } from '../support/utils.js'

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

const assertItem1IsVisible = () => {
    cy.getByDataTest('slideshow-next-button').should('be.visible')

    // check that only the first item is shown
    assertItemIsVisible(0)
    assertItemIsNotVisible(1)
    assertItemIsNotVisible(2)

    cy.getByDataTest('slideshow-page-counter').should('have.text', '1 / 11')

    // visible item does not have context menu button
    getDashboardItem(sortedDashboardItemIds[0])
        .findByDataTest('dashboarditem-menu-button')
        .should('not.exist')
}

const assertItem2IsVisible = () => {
    assertItemIsNotVisible(0)
    assertItemIsVisible(1)
    assertItemIsNotVisible(2)

    cy.getByDataTest('slideshow-page-counter').should('have.text', '2 / 11')
}

const assertItem3IsVisible = () => {
    assertItemIsNotVisible(0)
    assertItemIsNotVisible(1)
    assertItemIsVisible(2)

    cy.getByDataTest('slideshow-page-counter').should('have.text', '3 / 11')
}

const assertNormalViewIsShown = () => {
    cy.getByDataTest('slideshow-next-button').should('not.exist')

    // Check that multiple items are shown
    assertItemIsVisible(0)
    assertItemIsVisible(1)
    assertItemIsVisible(2)

    // Assert items have context menu button
    getDashboardItem(sortedDashboardItemIds[0])
        .findByDataTest('dashboarditem-menu-button')
        .should('be.visible')

    getDashboardItem(sortedDashboardItemIds[1])
        .findByDataTest('dashboarditem-menu-button')
        .should('be.visible')
}

describe('Slideshow functionality', () => {
    it('view a dashboard in slideshow mode', () => {
        cy.visit(`/${dashboards.Delivery.route}`)
        confirmViewMode(dashboards.Delivery.title)

        // Click the slideshow button
        cy.get('button').contains('Slideshow').realClick()

        // Assert item 1 is shown in fullscreen
        assertItem1IsVisible()

        // Click the next slide button
        cy.getByDataTest('slideshow-next-button').realClick()

        // Assert item 2 is shown in fullscreen
        assertItem2IsVisible()

        // Click the previous slide button
        cy.getByDataTest('slideshow-prev-button').realClick()

        // Assert item 1 is shown in fullscreen
        assertItem1IsVisible()

        // Click the exit slideshow button
        cy.getByDataTest('slideshow-exit-button', EXTENDED_TIMEOUT).realClick()

        // Assert the normal view is shown
        assertNormalViewIsShown()
    })

    it('view fullscreen on the second item of the dashboard', () => {
        // Open the Delivery dashboard
        cy.visit(`/${dashboards.Delivery.route}`)
        confirmViewMode(dashboards.Delivery.title)

        // Click the fullscreen button on the second item
        clickMenuButton(sortedDashboardItemIds[1])
        cy.contains('View fullscreen').realClick()

        // Assert item 2 is shown in fullscreen
        assertItem2IsVisible()

        // Click the exit slideshow button
        cy.getByDataTest('slideshow-exit-button', EXTENDED_TIMEOUT).realClick()

        // Assert the normal view is shown
        assertNormalViewIsShown()
    })

    it('view fullscreen on the third item of the dashboard and navigate backwards', () => {
        // Open the Delivery dashboard
        cy.visit(`/${dashboards.Delivery.route}`)
        confirmViewMode(dashboards.Delivery.title)

        // Click the fullscreen button on the third item
        clickMenuButton(sortedDashboardItemIds[2])
        cy.contains('View fullscreen').realClick()

        // Assert item 3 is shown in fullscreen
        assertItem3IsVisible()

        // Click the previous slide button
        cy.getByDataTest('slideshow-prev-button').realClick()

        // Assert item 2 is shown in fullscreen
        assertItem2IsVisible()

        // Click the previous slide button
        cy.getByDataTest('slideshow-prev-button').realClick()

        // Assert item 1 is shown in fullscreen
        assertItem1IsVisible()

        // Click the exit slideshow button
        cy.getByDataTest('slideshow-exit-button', EXTENDED_TIMEOUT).realClick()

        // Assert the normal view is shown
        assertNormalViewIsShown()
    })
})
