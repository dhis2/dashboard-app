Feature: Item context menu

    # FIXME - re-enable when dv plugin is fixed
    # @nonmutating
    # Scenario: View chart as table
    #     Given I open the "Delivery" dashboard
    #     And the chart dashboard item displays as a chart
    #     And the table dashboard item displays as a table
    #     When I click View As Table on a chart dashboard item
    #     Then the chart dashboard item displays as a table

    # @nonmutating
    # Scenario: View chart as map
    #     Given I open the "Delivery" dashboard
    #     And the chart dashboard item displays as a chart
    #     And the table dashboard item displays as a table
    #     When I click View As Map on a chart dashboard item
    #     Then the chart dashboard item displays as a map

    # @nonmutating
    # Scenario: View table as chart
    #     Given I open the "Delivery" dashboard
    #     And the chart dashboard item displays as a chart
    #     And the table dashboard item displays as a table
    #     When I click View As Chart on a table dashboard item
    #     Then the table dashboard item displays as a chart

    @nonmutating
    Scenario: Open chart in Data Visualizer app
        Given I open the "Delivery" dashboard
        When I click Open in Data Visualizer app on a chart dashboard item
        Then the chart is opened in the Data Visualizer app

    @nonmutating
    Scenario: Open the interpretations panel
        Given I open the "Delivery" dashboard
        When I click Show details and interpretations on a chart dashboard item
        Then the interpretations panel is displayed

    @nonmutating
    Scenario: Text item does not have a context menu
        Given I open the "Antenatal Care" dashboard
        Then the text item does not have a context menu

    @nonmutating
    Scenario: Chart item has a fullscreen option
        Given I open the "Antenatal Care" dashboard
        Then the chart item has a fullscreen option in the context menu



