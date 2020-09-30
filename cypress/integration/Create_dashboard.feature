Feature: The dashboard is displayed

    Scenario: User creates a new dashboard
        Given user chooses to create new dashboard
        And dashboard title is added
        And dashboard items are added
        And dashboard is saved
        Then dashboard displays in view mode
        And the saved dashboard should be displayed

    Scenario: User cancels a delete dashboard action
        Given user opens existing dashboard
        When user chooses to edit dashboard
        And user chooses to delete dashboard
        And user cancels delete
        Then the dashboard displays in edit mode


    Scenario: User deletes a dashboard
        Given user opens existing dashboard
        When user chooses to edit dashboard
        And user chooses to delete dashboard
        And user confirms delete
        Then dashboard displays in view mode
        And the dashboard is deleted and first starred dashboard displayed
