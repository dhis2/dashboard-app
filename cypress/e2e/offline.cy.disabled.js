describe.skip('Offline dashboard', () => {
    // Note: localStorage is cleared between each test, which causes caches to be
    // cleared according to the `clearSensitiveCaches` function from the
    // platform. Because of this, dashboards must be cached in each test that
    // requires a cached dashboard

    it('I cache an uncached dashboard', () => {
        //     Given I create two dashboards
        //     When I cache one of the dashboards
        //     Then the cached dashboard has a Last Updated time and chip icon
        //     And the uncached dashboard does not have a Last Updated time and no chip icon
    })

    it('I am online with an uncached dashboard when I lose connectivity', () => {
        //     Given I open an uncached dashboard
        //     When connectivity is turned off
        //     Then all actions for "uncached" dashboard requiring connectivity are disabled
    })

    // Scenario: I am online with a cached dashboard when I lose connectivity
    it('I am online with a cached dashboard when I lose connectivity', () => {
        //     Given I open and cache a dashboard
        //     Then the cached dashboard options are available
        //     When connectivity is turned off
        //     Then all actions for "cached" dashboard requiring connectivity are disabled
    })

    // Scenario: I am offline and switch from a cached dashboard to an uncached dashboard
    it('I am offline and switch from a cached dashboard to an uncached dashboard', () => {
        //     Given I open and cache a dashboard
        //     And connectivity is turned off
        //     When I click to open an uncached dashboard when offline
        //     Then the dashboard is not available and offline message is displayed
    })

    // Scenario: I am offline and switch to a cached dashboard
    it('I am offline and switch to a cached dashboard', () => {
        //     Given I open and cache a dashboard
        //     Given I open an uncached dashboard
        //     And connectivity is turned off
        //     When I click to open a cached dashboard when offline
        //     Then the cached dashboard is loaded and displayed in view mode
    })

    // Scenario: I am offline and switch to an uncached dashboard and then connectivity is restored
    it('I am offline and switch to an uncached dashboard and then connectivity is restored', () => {
        //     Given I open and cache a dashboard
        //     And connectivity is turned off
        //     When I click to open an uncached dashboard when offline
        //     Then the dashboard is not available and offline message is displayed
        //     When connectivity is turned on
        //     Then the uncached dashboard is loaded and displayed in view mode
    })

    // Scenario: I am in edit mode on an uncached dashboard when I lose connectivity and then I exit without saving and then connectivity is restored
    it('I am in edit mode on an uncached dashboard when I lose connectivity and then I exit without saving and then connectivity is restored', () => {
        //     Given I open an uncached dashboard in edit mode
        //     When connectivity is turned off
        //     Then all edit actions requiring connectivity are disabled
        //     When I click Exit without saving
        //     Then the dashboard is not available and offline message is displayed
        //     When connectivity is turned on
        //     Then the uncached dashboard is loaded and displayed in view mode
    })

    // Scenario: I am in edit mode on a cached dashboard when I lose connectivity and then I exit without saving
    it('I am in edit mode on a cached dashboard when I lose connectivity and then I exit without saving', () => {
        //     Given I open a cached dashboard in edit mode
        //     When connectivity is turned off
        //     Then all edit actions requiring connectivity are disabled
        //     When I click Exit without saving
        //     Then the cached dashboard is loaded and displayed in view mode
    })

    // Scenario: I am in edit mode when I lose connectivity and then connectivity is restored
    it('I am in edit mode when I lose connectivity and then connectivity is restored', () => {
        //     Given I open an uncached dashboard in edit mode
        //     When connectivity is turned off
        //     Then all edit actions requiring connectivity are disabled
        //     When connectivity is turned on
        //     Then all edit actions requiring connectivity are enabled
    })

    // Scenario: I remove a dashboard from cache while offline
    it('I remove a dashboard from cache while offline', () => {
        //     Given I open and cache a dashboard
        //     And connectivity is turned off
        //     When I click to Remove from offline storage
        //     Then the dashboard is not cached
        //     When connectivity is turned on
        //     Then I cache one of the dashboards
    })

    // FIXME
    // Scenario: The sharing dialog is open when connectivity is lost
    it.skip('The sharing dialog is open when connectivity is lost', () => {
        //     Given I open and cache a dashboard
        //     When I open sharing settings
        //     And connectivity is turned off
        //     Then it is not possible to change sharing settings
    })

    it('interpretations panel is open when connectivity is lost', () => {
        //     Given I open and cache a dashboard
        //     And I open the interpretations panel
        //     When connectivity is turned off
        //     Then it is not possible to interact with interpretations
    })

    it('show description while offline', () => {
        //     Given I open an uncached dashboard
        //     And connectivity is turned off
        //     When I choose Show Description
        //     Then the description is shown along with a warning
    })

    it('delete dashboard', () => {
        // deleteDashboard()
    })
})
