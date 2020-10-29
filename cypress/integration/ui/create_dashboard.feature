Feature: Creating and deleting dashboard

    Scenario: I create a new dashboard
        Given I choose to create new dashboard
        And dashboard title is added
        And dashboard items are added
        And dashboard is saved
        Then dashboard displays in view mode
        And the saved dashboard should be displayed

    Scenario: I cancel a delete dashboard action
        Given I open existing dashboard
        When I choose to edit dashboard
        And I choose to delete dashboard
        And I cancel delete
        Then the dashboard displays in edit mode


    Scenario: I delete a dashboard
        Given I open existing dashboard
        When I choose to edit dashboard
        And I choose to delete dashboard
        And I confirm delete
        Then dashboard displays in view mode
        And the dashboard is deleted and first starred dashboard displayed
