Feature: Slideshow

    Scenario: I view a dashboard in slideshow
        Given I open the "Delivery" dashboard
        When I click the slideshow button
        Then the slideshow view is shown
        When I click the exit slideshow button
        Then the normal view is shown