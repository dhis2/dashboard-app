Feature: Error occurs while editing a dashboard

    @nonmutating
    Scenario: An error occurs while saving a dashboard that I don't have access to
        Given I open the "Delivery" dashboard
        When I choose to edit dashboard
        And I save dashboard that I don't have access to save
        Then I remain in edit mode and error message is displayed

    @nonmutating
    Scenario: A 500 error is thrown when I save the dashboard
        Given I open the "Delivery" dashboard
        When I choose to edit dashboard
        And A 500 error is thrown when I save the dashboard
        Then I remain in edit mode and error message is displayed

    @nonmutating
    Scenario: A 500 error is thrown when I delete the dashboard
        Given I open the "Delivery" dashboard
        When I choose to edit dashboard
        And A 500 error is thrown when I delete the dashboard
        Then I remain in edit mode and error message is displayed
