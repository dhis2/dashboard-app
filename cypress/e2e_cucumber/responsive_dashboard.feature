        
        
        Scenario: I cannot edit dashboard filter while in small screen
                Given I open the "Delivery" dashboard
                And I add a "Period" filter
                When I go to small screen
                And I click on the "Period" filter badge
                Then the filter modal is not opened


# Scenario: Dashboards bar scrolls away in phone landscape
#     Given I open the "Delivery" dashboard
#     When I go to phone landscape
#     And I scroll down
#     Then the dashboards bar is not visible
#     When I scroll to top
#     Then the dashboards bar is visible

        
        Scenario: Edit bar scrolls away in phone landscape
                Given I open the "Delivery" dashboard
                When I choose to edit dashboard
                And I go to phone landscape
                And I scroll down
                Then the edit control bar is not visible
                When I scroll to top
                Then the edit control bar is visible
