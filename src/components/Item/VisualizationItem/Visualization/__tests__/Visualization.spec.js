import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import Visualization from '../Visualization.js'

jest.mock(
    '../DataVisualizerPlugin',
    () =>
        function MockVisualizationPlugin() {
            return <div className="visualization-plugin" />
        }
)

jest.mock(
    '../MapPlugin',
    () =>
        function MockMapPlugin() {
            return <div className="map-plugin" />
        }
)
jest.mock(
    '../DefaultPlugin',
    () =>
        function MockDefaultPlugin() {
            return <div className="default-plugin" />
        }
)

jest.mock(
    '../IframePlugin',
    () =>
        function MockIframePlugin() {
            return <div className="iframe-plugin" />
        }
)

const mockStore = configureMockStore()
const DEFAULT_STORE_WITH_ONE_ITEM = {
    visualizations: { rainbowVis: { rows: [], columns: [], filters: [] } },
    itemFilters: {},
    selected: {
        id: 'test-dashboard',
    },
}

test('renders a MapPlugin when activeType is MAP', () => {
    const { container } = render(
        <Provider store={mockStore(DEFAULT_STORE_WITH_ONE_ITEM)}>
            <Visualization
                item={{
                    id: 'rainbow',
                    type: 'MAP',
                    map: { id: 'rainbowVis' },
                }}
                activeType="MAP"
                itemFilters={{}}
                availableHeight={500}
            />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('renders a VisualizationPlugin for CHART', () => {
    const { container } = render(
        <Provider store={mockStore(DEFAULT_STORE_WITH_ONE_ITEM)}>
            <Visualization
                item={{
                    id: 'rainbow',
                    type: 'VISUALIZATION',
                    visualization: { id: 'rainbowVis', type: 'BAR' },
                }}
                activeType="CHART"
                itemFilters={{}}
                availableHeight={500}
            />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('renders a VisualizationPlugin for REPORT_TABLE', () => {
    const { container } = render(
        <Provider store={mockStore(DEFAULT_STORE_WITH_ONE_ITEM)}>
            <Visualization
                item={{
                    id: 'rainbow',
                    type: 'VISUALIZATION',
                    visualization: { id: 'rainbowVis', type: 'PIVOT_TABLE' },
                }}
                activeType="REPORT_TABLE"
                itemFilters={{}}
                availableHeight={500}
            />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('renders active type MAP rather than original type REPORT_TABLE', () => {
    const { container } = render(
        <Provider store={mockStore(DEFAULT_STORE_WITH_ONE_ITEM)}>
            <Visualization
                item={{
                    id: 'rainbow',
                    type: 'VISUALIZATION',
                    visualization: { id: 'rainbowVis', type: 'PIVOT_TABLE' },
                }}
                activeType="MAP"
                itemFilters={{}}
                availableHeight={500}
            />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('renders a DefaultPlugin when activeType is EVENT_CHART', () => {
    const { container } = render(
        <Provider store={mockStore(DEFAULT_STORE_WITH_ONE_ITEM)}>
            <Visualization
                item={{
                    id: 'rainbow',
                    type: 'EVENT_CHART',
                    eventChart: { id: 'rainbowVis' },
                }}
                activeType="EVENT_CHART"
                itemFilters={{}}
                availableHeight={500}
            />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('renders a DefaultPlugin when activeType is EVENT_REPORT', () => {
    const { container } = render(
        <Provider store={mockStore(DEFAULT_STORE_WITH_ONE_ITEM)}>
            <Visualization
                item={{
                    id: 'rainbow',
                    type: 'EVENT_REPORT',
                    eventReport: { id: 'rainbowVis' },
                }}
                activeType="EVENT_REPORT"
                itemFilters={{}}
                availableHeight={500}
            />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('renders NoVisMessage when no visualization', () => {
    const store = {
        visualizations: {},
        selected: {
            id: 'test-dashboard',
        },
    }
    const { container } = render(
        <Provider store={mockStore(store)}>
            <Visualization
                item={{
                    id: 'rainbow',
                    type: 'VISUALIZATION',
                    visualization: { type: 'BAR' },
                }}
                activeType="CHART"
                itemFilters={{}}
                availableHeight={500}
            />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})
