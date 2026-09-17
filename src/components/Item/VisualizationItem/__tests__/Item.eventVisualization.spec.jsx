import { render, act } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { apiFetchVisualization } from '../../../../api/fetchVisualization.js'
import { MIN_API_VERSION_FOR_EVER } from '../../../../modules/isAppVersionCompatible.js'
import * as mockData from '../../../__mocks__/AppData.js'
import WindowDimensionsProvider from '../../../WindowDimensionsProvider.jsx'
import { Item } from '../../Item.jsx'

const BELOW_EVER = MIN_API_VERSION_FOR_EVER - 1

// Mutable so each test can pick the backend version without re-mocking
let mockApiVersion

jest.mock('../../../../api/fetchVisualization')

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useConfig: () => ({ baseUrl: 'dhis2', apiVersion: mockApiVersion }),
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
    it(`does not fetch for EVENT_VISUALIZATION from api version ${MIN_API_VERSION_FOR_EVER}`, async () => {
        // The standalone plugin fetches the visualization itself
        mockApiVersion = MIN_API_VERSION_FOR_EVER

        await renderItem(eventVisualizationItem)

        expect(apiFetchVisualization).not.toHaveBeenCalled()
    })

    it(`still fetches for EVENT_VISUALIZATION below api version ${MIN_API_VERSION_FOR_EVER}`, async () => {
        // The Line Listing plugin is handed the visualization by the dashboard
        mockApiVersion = BELOW_EVER

        await renderItem(eventVisualizationItem)

        expect(apiFetchVisualization).toHaveBeenCalled()
    })

    it('still fetches for other item types on a new backend', async () => {
        mockApiVersion = MIN_API_VERSION_FOR_EVER

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
