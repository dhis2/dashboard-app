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

    @nonmutating
    Scenario: I move an item on a dashboard
        Given I open existing dashboard
        When I choose to edit dashboard
        Then the dashboard displays in edit mode
        And the chart item is displayed
        Then no analytics requests are made when item is moved

    @mutating
    Scenario: I cancel a delete dashboard action
        Given I open existing dashboard
        When I choose to edit dashboard
        And I choose to delete dashboard
        And I cancel delete
        Then the dashboard displays in edit mode

    @mutating
    Scenario: I delete a dashboard
        Given I open existing dashboard
        When I choose to edit dashboard
        And I choose to delete dashboard
        And I confirm delete
        Then dashboard displays in view mode
        And the dashboard is deleted and first starred dashboard displayed
