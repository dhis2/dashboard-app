Feature: Smoke test

    @nonmutating
    Scenario: I open a dashboard
        Given I open the "Delivery" dashboard
        Then the "Delivery" dashboard displays in view mode
