Feature: Creating, editing and deleting dashboard

    @mutating
    Scenario: I create a new dashboard
        Given I start a new dashboard
        And dashboard title is added
        And dashboard items are added
        And I close the item selector
        And dashboard is saved
        Then the dashboard displays in view mode
        And the saved dashboard should be displayed

    @mutating
    Scenario: I exit without saving when no changes
        Given I open existing dashboard
        When I choose to edit dashboard
        And I click Exit without saving
        Then the dashboard displays in view mode

    @mutating
    Scenario: I cancel exit without saving when name changed
        Given I open existing dashboard
        When I choose to edit dashboard
        And dashboard title is added
        And I click Exit without saving
        And I decide to continue editing
        Then the dashboard displays in edit mode

    # @mutating
    # Scenario: I cancel exit without saving when item added
    #     Given I open existing dashboard
    #     When I choose to edit dashboard
    #     And dashboard items are added
    #     And I close the item selector
    #     And I click Exit without saving
    #     And I decide to continue editing
    #     Then the dashboard displays in edit mode

    @mutating
    Scenario: I exit without saving when name changed
        Given I open existing dashboard
        When I choose to edit dashboard
        And dashboard title is added
        And I click Exit without saving
        And I confirm I want to discard changes
        Then the dashboard displays in view mode

    # @mutating
    # Scenario: I star the dashboard
    #     Given I open existing dashboard
    #     And the dashboard is not starred
    #     When I click to star the dashboard
    #     Then the dashboard is starred
    #     When I click to unstar the dashboard
    #     Then the dashboard is not starred


    @mutating
    Scenario: I toggle show description
        Given I open existing dashboard
        # And the description is not shown
        And the dashboard description is not displayed
        When I click to show description
        Then the dashboard description is displayed
        When I click to hide the description
        Then the dashboard description is not displayed

    @nonmutating
    Scenario: I move an item on a dashboard
        Given I open existing dashboard
        When I choose to edit dashboard
        And the chart item is displayed
        Then no analytics requests are made when item is moved

    # @mutating
    # Scenario: I add translations to a dashboard and save dashboard
    #     Given I open existing dashboard
    #     When I choose to edit dashboard
    #     And I add translations for dashboard name and description
    #     And dashboard is saved
    #     Then Norwegian title and description are displayed

    # @mutating
    # Scenario: I add translations to a dashboard and discard dashboard changes
    #     Given I open existing dashboard
    #     When I choose to edit dashboard
    #     And I add translations for dashboard name and description
    #     And I click Exit without saving
    #     Then Norwegian title and description are displayed

    @mutating
    Scenario: I change sharing settings of a dashboard
        Given I open existing dashboard
        When I change sharing settings
        And I choose to edit dashboard
        And dashboard is saved
        Then the new sharing settings should be preserved

    @mutating
    Scenario: I save a starred dashboard
        Given I open existing dashboard
        And the dashboard is not starred
        When I click to star the dashboard
        Then the dashboard is starred
        When I choose to edit dashboard
        And dashboard is saved
        Then the dashboard displays in view mode
        And the dashboard is starred
        When I click to unstar the dashboard
        Then the dashboard is not starred

    @nonmutating
    Scenario: I cancel a delete dashboard action
        Given I open existing dashboard
        When I choose to edit dashboard
        And I choose to delete dashboard
        Then the confirm delete dialog is displayed
        When I cancel delete
        Then the dashboard displays in edit mode

    @mutating
    Scenario: I delete a dashboard
        Given I open existing dashboard
        When I choose to edit dashboard
        And I choose to delete dashboard
        Then the confirm delete dialog is displayed
        When I confirm delete
        Then different dashboard displays in view mode
        And the dashboard is deleted and first starred dashboard displayed
