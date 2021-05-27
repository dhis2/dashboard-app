import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
// import { EXTENDED_TIMEOUT } from '../../../support/utils'

// Scenario: I am online with an uncached dashboard when I lose connectivity

Given('I open an uncached dashboard', () => {
    // open the uncached dashboard
    // check that view mode is shown
    // check that there is no "Last updated" tag
    // check that the correct options under "More" are available
})
When('connectivity is turned off', () => {
    // call the chrome dev tools thingy
})

When('connectivity is turned on', () => {
    // call the chrome dev tools thingy
})

Then('all actions requiring connectivity are disabled', () => {
    // new button
    // edit, sharing, starring, filtering, all options under more
    // item context menu (everything except view fullscreen)
})

// Scenario: I am online with a cached dashboard when I lose connectivity
Given('I open a cached dashboard', () => {
    // open the cached dashboard
    // check that view mode is shown
    // check that the chip has the icon? (or maybe component test for this)
    // check for the "Last updated tag"
    // check that the correct options under "More" are available
})

// Scenario: I am offline and switch to an uncached dashboard

// Scenario: I am offline and switch to a cached dashboard

// Scenario: I am offline and switch to an uncached dashboard and then connectivity is restored

// Scenario: I am in edit mode on an uncached dashboard when I lose connectivity and then I exit without saving and then connectivity is restored
Given('I open an uncached dashboard in edit mode', () => {})
Then('all actions requiring connectivity are disabled', () => {})
When('I click Exit without saving', () => {})
Then(
    'the dashboard is not available while offline message is displayed',
    () => {}
)
When('connectivity is turned on', () => {})
Then('the dashboard is loaded and displayed in view mode', () => {})

// Scenario: I am in edit mode on a cached dashboard when I lose connectivity and then I exit without saving
Given('I open a cached dashboard in edit mode', () => {})
