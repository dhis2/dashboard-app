Feature: Small screen dashboard

    @nonmutating
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

    @nonmutating
    Scenario: I am creating a new dashboard
        Given I choose to create new dashboard
        And dashboard title is changed
        And dashboard items are added
        When I go to small screen
        Then the small screen edit view is shown
        When I restore the wide screen
        Then the wide screen edit view is shown
        And my changes are still there

    @nonutating
    Scenario: I change the url to new while in small screen
        Given I open the "Delivery" dashboard
        When I go to small screen
        And I change url to new
        Then the "Delivery" dashboard displays in default view mode


    @nonutating
    Scenario: I change the url to edit while in small screen
        Given I open the "Delivery" dashboard
        When I go to small screen
        And I change url to edit
        Then the "Delivery" dashboard displays in view mode

    @nonmutating
    Scenario: I cannot edit dashboard filter while in small screen
        Given I open the "Delivery" dashboard
        And I add a "Period" filter
        When I go to small screen
        And I click on the "Period" filter badge
        Then the filter modal is not opened