Feature: Small screen dashboard

    @mutating
    Scenario: I view a dashboard
        Given I open the "Delivery" dashboard
        When I go to small screen
        Then the small screen view is shown
        When I restore the wide screen
        Then the wide screen view is shown

    @nonmutating
    Scenario: I am editing an existing dashboard
        Given I open the "Delivery" dashboard
        When I choose to edit dashboard
        And dashboard title is changed
        And dashboard items are added
        When I go to small screen
        Then the small screen edit view is shown
        When I restore the wide screen
        Then the wide screen edit view is shown
        And my changes are still there

    @mutating
    Scenario: I am creating a new dashboard
        Given I choose to create new dashboard
        And dashboard title is changed
        And dashboard items are added
        When I go to small screen
        Then the small screen edit view is shown
        When I restore the wide screen
        Then the wide screen edit view is shown
        And my changes are still there
