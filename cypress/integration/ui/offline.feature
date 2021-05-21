Feature: Offline dashboard

    Scenario: I cache an uncached dashboard
        Given I choose to create new dashboard
        When I make the dashboard available offline
        Then the dashboard is available offline

    Scenario: I am online with an uncached dashboard when I lose connectivity
        Given I open an uncached dashboard
        When connectivity is turned off
        Then all actions requiring connectivity are disabled

    Scenario: I am online with a cached dashboard when I lose connectivity
        Given I open a cached dashboard
        When connectivity is turned off
        Then all actions requiring connectivity are disabled

    Scenario: I am offline and switch from a cached dashboard to an uncached dashboard
        Given I open a cached dashboard
        And connectivity is turned off
        When I click to open an uncached dashboard
        Then the dashboard is not available while offline message is displayed

    Scenario: I am offline and switch to a cached dashboard
        Given I open a cached dashboard
        And connectivity is turned off
        When I click to open a cached dashboard
        Then the dashboard is loaded and displayed in view mode

    Scenario: I am offline and switch to an uncached dashboard and then connectivity is restored
        Given I open a cached dashboard
        And connectivity is turned off
        When I click to open an uncached dashboard
        Then the dashboard not available while offline message is displayed
        When connectivity is turned on
        Then the dashboard is loaded and displayed in view mode

    Scenario: I am in edit mode on an uncached dashboard when I lose connectivity and then I exit without saving and then connectivity is restored
        Given I open an uncached dashboard in edit mode
        When connectivity is turned off
        Then all actions requiring connectivity are disabled
        When I click Exit without saving
        Then the dashboard is not available while offline message is displayed
        When connectivity is turned on
        Then the dashboard is loaded and displayed in view mode

    Scenario: I am in edit mode on a cached dashboard when I lose connectivity and then I exit without saving
        Given I open a cached dashboard in edit mode
        When connectivity is turned off
        Then all actions requiring connectivity are disabled
        When I click Exit without saving
        Then the dashboard is loaded and displayed in view mode

    Scenario: The sharing dialog is open when connectivity is lost
        Given I open a cached dashboard
        When I open sharing settings
        And connectivity is turned off
        Then it is not possible to change settings
        Then I close the sharing dialog

    Scenario: The interpretations panel is open when connectivity is lost
        Given I open a cached dashboard
        And connectivity is turned off
        When I open the item menu
        Then all item options requiring connectivity are disabled
