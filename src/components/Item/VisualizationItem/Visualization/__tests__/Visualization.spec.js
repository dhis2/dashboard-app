import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'

import Visualization from '../Visualization'

jest.mock('@dhis2/data-visualizer-plugin', () => 'VisualizationPlugin')
jest.mock('../MapPlugin', () => 'MapPlugin')
jest.mock('../DefaultPlugin', () => 'DefaultPlugin')

const mockStore = configureMockStore()

test('renders a MapPlugin when activeType is MAP', () => {
    const store = {
        visualizations: { rainbowVis: { rows: [], columns: [], filters: [] } },
    }
    const { container } = render(
        <Provider store={mockStore(store)}>
            <Visualization
                item={{
                    id: 'rainbow',
                    type: 'MAP',
                    chart: { id: 'rainbowVis' },
                }}
                activeType="MAP"
                itemFilters={{}}
                availableHeight={500}
            />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('renders a VisPlugin when activeType is CHART', () => {
    const store = {
        visualizations: { rainbowVis: { rows: [], columns: [], filters: [] } },
    }
    const { container } = render(
        <Provider store={mockStore(store)}>
            <Visualization
                item={{
                    id: 'rainbow',
                    type: 'REPORT_TABLE',
                    chart: { id: 'rainbowVis' },
                }}
                activeType="CHART"
                itemFilters={{}}
                availableHeight={500}
            />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('renders a VisPlugin when activeType is TABLE', () => {
    const store = {
        visualizations: { rainbowVis: { rows: [], columns: [], filters: [] } },
    }
    const { container } = render(
        <Provider store={mockStore(store)}>
            <Visualization
                item={{
                    id: 'rainbow',
                    type: 'CHART',
                    chart: { id: 'rainbowVis' },
                }}
                activeType="REPORT_TABLE"
                itemFilters={{}}
                availableHeight={500}
            />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('renders a DefaultPlugin when activeType is EVENT_CHART', () => {
    const store = {
        visualizations: { rainbowVis: { rows: [], columns: [], filters: [] } },
    }
    const { container } = render(
        <Provider store={mockStore(store)}>
            <Visualization
                item={{
                    id: 'rainbow',
                    type: 'EVENT_CHART',
                    chart: { id: 'rainbowVis' },
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
    const store = {
        visualizations: { rainbowVis: { rows: [], columns: [], filters: [] } },
    }
    const { container } = render(
        <Provider store={mockStore(store)}>
            <Visualization
                item={{
                    id: 'rainbow',
                    type: 'EVENT_REPORT',
                    chart: { id: 'rainbowVis' },
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
    }
    const { container } = render(
        <Provider store={mockStore(store)}>
            <Visualization
                item={{ id: 'rainbow' }}
                activeType="CHART"
                itemFilters={{}}
                availableHeight={500}
            />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})
