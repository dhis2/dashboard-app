import { dashboards } from '../assets/backends/sierraLeone_236.js'
import { clickMenuButton, getDashboardItem } from '../elements/dashboardItem.js'
import { dashboardTitleSel } from '../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT } from '../support/utils.js'

const sortedDashboardItemIds = ['GaVhJpqABYX', 'qXsjttMYuoZ', 'Rwb3oXJ3bZ9']

const confirmViewMode = (dashboardTitle) => {
    cy.url().should('not.include', 'edit')

    if (dashboardTitle) {
        cy.get(dashboardTitleSel, EXTENDED_TIMEOUT)
            .should('be.visible')
            .and('contain', dashboardTitle)
    } else {
        cy.get(dashboardTitleSel, EXTENDED_TIMEOUT).should('be.visible')
    }
}

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

const assertSlideshowControlbar = () => {
    cy.getByDataTest('slideshow-controlbar').should('be.visible')

    // Assert the exit button is shown
    cy.getByDataTest('slideshow-exit-button').should('be.visible')

    // Assert the next and previous buttons are shown
    cy.getByDataTest('slideshow-next-button').should('be.visible')
    cy.getByDataTest('slideshow-page-counter').should('be.visible')
    cy.getByDataTest('slideshow-prev-button').should('be.visible')

    // Assert the autoplay controls are shown
    cy.getByDataTest('slideshow-autoplay-settings-button').should('be.visible')
    cy.getByDataTest('slideshow-autoplay-play-pause-button').should(
        'be.visible'
    )
}

const assertAutoplaySettingsMenuIsShown = () => {
    cy.contains('10 seconds per slide').should('be.visible')
    cy.contains('20 seconds per slide').should('be.visible')
    cy.contains('30 seconds per slide').should('be.visible')
    cy.contains('1 minute per slide').should('be.visible')
    cy.contains('2 minutes per slide').should('be.visible')
}

describe('Slideshow functionality', () => {
    it('view a dashboard in slideshow mode', () => {
        cy.visit(`/${dashboards.Delivery.route}`)
        confirmViewMode(dashboards.Delivery.title)

        // Click the slideshow button
        cy.get('button').contains('Slideshow').realClick()

        // Assert fullscreen mode is shown
        assertSlideshowControlbar()

        // Assert slideshow starts in play mode (Pause icon is shown)
        cy.log('Confirm we are in autoplay mode')
        cy.getByDataTest('slideshow-pause-icon').should('be.visible')
        cy.getByDataTest('slideshow-play-icon').should('not.exist')
        // Click to pause autoplay
        cy.log('Pause autoplay')
        cy.getByDataTest('slideshow-autoplay-play-pause-button').click()

        cy.log('Confirm we are in pause mode')
        cy.getByDataTest('slideshow-pause-icon').should('not.exist')
        cy.getByDataTest('slideshow-play-icon').should('be.visible')

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

        // Assert fullscreen mode is shown
        assertSlideshowControlbar()

        // Assert item 2 is shown in fullscreen
        assertItem2IsVisible()

        // cy.log('Confirm we are in pause mode')
        cy.getByDataTest('slideshow-pause-icon').should('not.exist')
        cy.getByDataTest('slideshow-play-icon').should('be.visible')

        // Click the exit slideshow button
        cy.getByDataTest('slideshow-exit-button').realClick()

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

        // Assert fullscreen mode is shown
        assertSlideshowControlbar()

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

    it('view slideshow autoplay', () => {
        // Open the Delivery dashboard
        cy.visit(`/${dashboards.Delivery.route}`)
        confirmViewMode(dashboards.Delivery.title)

        // Click the slideshow button
        cy.get('button').contains('Slideshow').realClick()

        // Assert fullscreen mode is shown
        assertSlideshowControlbar()

        // Assert the settings menu
        cy.getByDataTest('slideshow-autoplay-settings-button').realClick()
        assertAutoplaySettingsMenuIsShown()

        // Close the settings menu
        cy.getByDataTest('dhis2-uicore-layer').realClick('topLeft')
        cy.contains('10 seconds per slide').should('not.exist')

        // Assert item 1 is shown in fullscreen
        assertItem1IsVisible()

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(11000) // Wait for the autoplay to switch to the next item

        // // Assert item 2 is shown after autoplay starts
        assertItem2IsVisible()

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(11000) // Wait for the autoplay to switch to the next item

        assertItem3IsVisible()

        // Click the exit slideshow button
        cy.getByDataTest('slideshow-exit-button').realClick()

        // Assert the normal view is shown
        assertNormalViewIsShown()
    })
})
