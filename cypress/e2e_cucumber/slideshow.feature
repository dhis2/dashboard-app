Feature: Slideshow

    Scenario: I view a dashboard in slideshow
        Given I open the "Delivery" dashboard
        When I click the slideshow button
        Then item 1 is shown in fullscreen
        When I click the next slide button
        Then item 2 is shown in fullscreen
        When I click the previous slide button
        Then item 1 is shown in fullscreen
        When I click the exit slideshow button
        Then the normal view is shown


    Scenario: I view fullscreen on the second item of the dashboard
        Given I open the "Delivery" dashboard
        When I click the fullscreen button on the second item
        Then item 2 is shown in fullscreen
        When I click the exit slideshow button
        Then the normal view is shown

    Scenario: I view fullscreen on the third item of the dashboard and navigate backwards
        Given I open the "Delivery" dashboard
        When I click the fullscreen button on the third item
        Then item 3 is shown in fullscreen
        When I click the previous slide button
        Then item 2 is shown in fullscreen
        When I click the previous slide button
        Then item 1 is shown in fullscreen
        When I click the exit slideshow button
        Then the normal view is shown
