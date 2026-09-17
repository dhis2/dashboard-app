import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { MIN_API_VERSION_FOR_EVER } from '../../../../../modules/isAppVersionCompatible.js'
import Visualization from '../Visualization.jsx'

const BELOW_EVER = MIN_API_VERSION_FOR_EVER - 1

// Mutable so each test can pick the backend version and which plugin apps are
// available, without re-mocking the modules
let mockApiVersion
let mockEVERCompatible
let mockLLCompatible

jest.mock('@dhis2/analytics', () => ({
    useCachedDataQuery: () => ({
        currentUser: { username: 'rainbowDash', id: 'r3nb0d5h' },
    }),
}))

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useConfig: () => ({ baseUrl: 'dhis2', apiVersion: mockApiVersion }),
}))

// Stub compatibility rather than driving it through installed-app versions:
// this spec is about which branch Visualization takes, and the version
// comparison itself is covered by isAppVersionCompatible.spec.js
jest.mock('../../../../../modules/isAppVersionCompatible.js', () => ({
    ...jest.requireActual('../../../../../modules/isAppVersionCompatible.js'),
    isDVVersionCompatible: () => false,
    isMapsVersionCompatible: () => false,
    isEVERVersionCompatible: () => mockEVERCompatible,
    isLLVersionCompatible: () => mockLLCompatible,
}))

jest.mock('../../../../AppDataProvider/AppDataProvider.jsx', () => ({
    useInstalledApps: () => [],
    useInstalledDVVersion: () => '0.0.0',
    useInstalledMapsVersion: () => '0.0.0',
    useInstalledEVERVersion: () => '0.0.0',
    useInstalledLLVersion: () => '0.0.0',
}))

// Captures what Visualization hands the plugin, which is the contract that
// differs between the standalone and non-standalone paths
let iframePluginProps
jest.mock(
    '../IframePlugin.jsx',
    () =>
        function MockIframePlugin(props) {
            iframePluginProps = props
            return <div className="iframe-plugin" />
        }
)

jest.mock(
    '../LegacyPlugin.jsx',
    () =>
        function MockLegacyPlugin() {
            return <div className="legacy-plugin" />
        }
)

const mockStore = configureMockStore()
const store = mockStore({
    visualizations: {},
    itemFilters: {},
    selected: { id: 'test-dashboard' },
})

const item = {
    id: 'rainbow',
    type: 'EVENT_VISUALIZATION',
    eventVisualization: { id: 'rainbowVis', type: 'LINE_LIST' },
}

const renderVisualization = (props = {}) =>
    render(
        <Provider store={store}>
            <Visualization
                item={item}
                activeType="EVENT_VISUALIZATION"
                originalType="EVENT_VISUALIZATION"
                itemFilters={{}}
                style={{ height: '500px' }}
                {...props}
            />
        </Provider>
    )

beforeEach(() => {
    iframePluginProps = undefined
    mockEVERCompatible = false
    mockLLCompatible = false
})

describe(`below api version ${MIN_API_VERSION_FOR_EVER} (Line Listing)`, () => {
    beforeEach(() => {
        mockApiVersion = BELOW_EVER
    })

    it('renders the plugin when the Line Listing app is compatible', () => {
        mockLLCompatible = true

        const { container } = renderVisualization({
            visualization: { id: 'rainbowVis', type: 'LINE_LIST' },
        })

        expect(container.querySelector('.iframe-plugin')).toBeTruthy()
    })

    it('passes the visualization object to the plugin', () => {
        mockLLCompatible = true
        const visualization = { id: 'rainbowVis', type: 'LINE_LIST' }

        renderVisualization({ visualization })

        expect(iframePluginProps.visualization).toEqual(visualization)
    })

    it('renders the overlay when filters are not applied', () => {
        mockLLCompatible = true

        const { getByText } = renderVisualization({
            visualization: { id: 'rainbowVis', type: 'LINE_LIST' },
            showNoFiltersOverlay: true,
        })

        expect(getByText('Show without filters')).toBeTruthy()
    })

    it('prompts to install the Line Listing app when incompatible', () => {
        const { getByText } = renderVisualization({
            visualization: { id: 'rainbowVis', type: 'LINE_LIST' },
        })

        expect(getByText(/Install Line Listing app .* or higher/)).toBeTruthy()
    })
})

describe(`from api version ${MIN_API_VERSION_FOR_EVER} (Event Visualizer)`, () => {
    beforeEach(() => {
        mockApiVersion = MIN_API_VERSION_FOR_EVER
    })

    it('renders the plugin when the Event Visualizer app is compatible', () => {
        mockEVERCompatible = true

        const { container } = renderVisualization()

        expect(container.querySelector('.iframe-plugin')).toBeTruthy()
    })

    it('passes visualizationId and filters instead of the visualization', () => {
        mockEVERCompatible = true
        const itemFilters = { ou: [{ id: 'ImspTQPwCqd' }] }

        renderVisualization({ itemFilters })

        expect(iframePluginProps.visualizationId).toBe('rainbowVis')
        expect(iframePluginProps.filters).toEqual(itemFilters)
        expect(iframePluginProps.visualization).toBeUndefined()
    })

    it('renders without fetching a visualization first', () => {
        // The standalone plugin fetches its own, so the dashboard must not
        // fall through to the "No data to display" guard
        mockEVERCompatible = true

        const { container, queryByText } = renderVisualization({
            visualization: undefined,
        })

        expect(queryByText('No data to display')).toBeNull()
        expect(container.querySelector('.iframe-plugin')).toBeTruthy()
    })

    it('does not render the overlay, since the plugin owns that notice', () => {
        mockEVERCompatible = true

        const { queryByText } = renderVisualization({
            showNoFiltersOverlay: true,
        })

        expect(queryByText('Show without filters')).toBeNull()
    })

    it('prompts to install the Event Visualizer app when incompatible', () => {
        const { getByText } = renderVisualization()

        expect(
            getByText(/Install Individual Data Visualizer app .* or higher/)
        ).toBeTruthy()
    })
})
