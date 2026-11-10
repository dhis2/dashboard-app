import { render, act } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { apiFetchVisualization } from '../../../../api/fetchVisualization.js'
import * as mockData from '../../../__mocks__/AppData.js'
import WindowDimensionsProvider from '../../../WindowDimensionsProvider.jsx'
import { Item } from '../../Item.jsx'

// Mutable so each test can pick the backend version without re-mocking
let mockServerVersion

jest.mock('../../../../api/fetchVisualization')

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useConfig: () => ({ baseUrl: 'dhis2', serverVersion: mockServerVersion }),
}))

jest.mock('../../../AppDataProvider/AppDataProvider.jsx', () => ({
    ...jest.requireActual('../../../AppDataProvider/AppDataProvider.jsx'),
    __esModule: true,
    default: ({ children }) => children,
    useInstalledApps: () => mockData.apps,
    useCurrentUser: () => mockData.currentUser,
    useSystemSettings: () => mockData.systemSettings,
}))

jest.mock(
    '../Visualization/Visualization.jsx',
    () =>
        function MockVisualizationComponent() {
            return <div className="visualization" />
        }
)

jest.mock(
    '../../ItemHeader/DeleteItemButton.jsx',
    () =>
        function Mock() {
            return <div className="DeleteItemButton" />
        }
)

const mockStore = configureMockStore()

const store = {
    itemFilters: {},
    itemActiveTypes: {},
    editDashboard: {},
    visualizations: {},
    slideshow: null,
}

const eventVisualizationItem = {
    type: 'EVENT_VISUALIZATION',
    eventVisualization: {
        id: 'rainbowVis',
        name: 'Inpatient cases',
        type: 'LINE_LIST',
    },
}

const renderItem = async (item) => {
    const promise = Promise.resolve()

    const rendered = render(
        <Provider store={mockStore(store)}>
            <WindowDimensionsProvider>
                <Item item={item} dashboardMode="view" />
            </WindowDimensionsProvider>
        </Provider>
    )

    await act(() => promise)

    return rendered
}

beforeEach(() => {
    jest.clearAllMocks()
    apiFetchVisualization.mockResolvedValue({
        EVENT_VISUALIZATION: { id: 'rainbowVis', type: 'LINE_LIST' },
    })
})

describe('fetching the visualization', () => {
    it('does not fetch for EVENT_VISUALIZATION from 2.43.3', async () => {
        // The standalone plugin fetches the visualization itself
        mockServerVersion = { major: 2, minor: 43, patch: 3 }

        await renderItem(eventVisualizationItem)

        expect(apiFetchVisualization).not.toHaveBeenCalled()
    })

    it('still fetches for EVENT_VISUALIZATION below 2.43.3', async () => {
        // The Line Listing plugin is handed the visualization by the dashboard
        mockServerVersion = { major: 2, minor: 42, patch: 0 }

        await renderItem(eventVisualizationItem)

        expect(apiFetchVisualization).toHaveBeenCalled()
    })

    it('still fetches for other item types on a new backend', async () => {
        mockServerVersion = { major: 2, minor: 43, patch: 3 }

        await renderItem({
            type: 'VISUALIZATION',
            visualization: {
                id: 'fancychart',
                name: 'Fancy Chart',
                type: 'COLUMN',
            },
        })

        expect(apiFetchVisualization).toHaveBeenCalled()
    })
})
