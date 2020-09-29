Feature: The dashboard is displayed

    Scenario: User creates a new dashboard
        Given user selects to create new dashboard
        And dashboard title is added
        And dashboard items are added
        And dashboard is saved
        Then the saved dashboard should display in view mode

    Scenario: User deletes a dashboard
        Given user opens existing dashboard
        When user chooses to edit dashboard
        And user chooses to delete dashboard
        And user confirms delete
        Then the dashboard is deleted and first starred dashboard displayed in view mode
