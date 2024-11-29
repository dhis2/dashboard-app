import { When, Then } from '@badeball/cypress-cucumber-preprocessor'

// When I click the slideshow button
//         Then the slideshow view is shown
//         When I click the exit slideshow button
//         Then the normal view is shown

const getSlideshowExitButton = () =>
    cy.getByDataTest('slideshow-exit-button', { timeout: 15000 })

When('I click the slideshow button', () => {
    cy.get('button').contains('Slideshow').realClick()
})

Then('the slideshow view is shown', () => {
    getSlideshowExitButton().should('be.visible')
})

When('I click the exit slideshow button', () => {
    getSlideshowExitButton().realClick()
})

Then('the normal view is shown', () => {
    getSlideshowExitButton().should('not.exist')
})
