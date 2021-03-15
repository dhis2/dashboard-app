Feature: Creating, editing and deleting dashboard

    @mutating
    Scenario: I create a new dashboard
        Given I choose to create new dashboard
        And dashboard title is added
        And dashboard items are added
        And I click outside menu
        And dashboard is saved
        Then dashboard displays in view mode
        And the saved dashboard should be displayed

    @mutating
    Scenario: I star the dashboard
        Given I open existing dashboard
        Then dashboard displays in view mode
        And the dashboard is not starred
        When I click to star the dashboard
        Then the dashboard is starred
        When I click to unstar the dashboard
        Then the dashboard is not starred


    @mutating
    Scenario: I toggle show description
        Given I open existing dashboard
        Then dashboard displays in view mode
        And the dashboard description is not displayed
        When I click to show description
        Then the dashboard description is displayed
        When I click to hide the description
        Then the dashboard description is not displayed

    @nonmutating
    Scenario: I move an item on a dashboard
        Given I open existing dashboard
        When I choose to edit dashboard
        Then the dashboard displays in edit mode
        And the chart item is displayed
        Then no analytics requests are made when item is moved

    @mutating
    Scenario: I add translations to a dashboard and save dashboard
        Given instance has db language set to Norwegian
        Given I open existing dashboard
        When I choose to edit dashboard
        And I add translations for dashboard name and description
        And dashboard is saved
        Then Norwegian title and description are displayed

    @mutating
    Scenario: I add translations to a dashboard and discard dashboard changes
        Given instance has db language set to Norwegian
        Given I open existing dashboard
        When I choose to edit dashboard
        And I add translations for dashboard name and description
        And I click Exit without saving
        Then Norwegian title and description are displayed


    @mutating
    Scenario: I change sharing settings of a dashboard
        Given I open existing dashboard
        When I change sharing settings
        And I choose to edit dashboard
        And dashboard is saved
        Then the new sharing settings should be preserved

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
