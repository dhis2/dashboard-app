import { render, act } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { apiFetchVisualization } from '../../../../api/fetchVisualization.js'
import * as mockData from '../../../__mocks__/AppData.js'
import AppDataProvider from '../../../AppDataProvider/AppDataProvider.jsx'
import WindowDimensionsProvider from '../../../WindowDimensionsProvider.jsx'
import { Item } from '../../Item.jsx'

jest.mock('../../../../api/fetchVisualization')
jest.mock('../../../AppDataProvider/AppDataProvider.jsx', () => ({
    ...jest.requireActual('../../../AppDataProvider/AppDataProvider.jsx'),
    __esModule: true,
    default: ({ children }) => children,
    useInstalledApps: () => mockData.apps,
    useCurrentUser: () => mockData.currentUser,
    useSystemSettings: () => mockData.systemSettings,
}))

jest.mock('../Visualization/plugin', () => {
    return {
        pluginIsAvailable: () => true,
    }
})

jest.mock(
    '../../ItemHeader/DeleteItemButton.jsx',
    () =>
        function Mock() {
            return <div className="DeleteItemButton" />
        }
)

jest.mock(
    '../Visualization/Visualization.jsx',
    () =>
        function MockVisualizationComponent(props) {
            return (
                <div
                    className="visualization"
                    // NOSONAR
                    item={props.item} // NOSONAR
                    activetype={props.activeType} // NOSONAR
                    itemfilters={props.itemFilters} // NOSONAR
                    availableheight={props.availableheight} // NOSONAR
                    availablewidth={props.availablewidth} // NOSONAR
                    gridwidth={props.gridWidth} // NOSONAR 
            )
        }
)

const mockStore = configureMockStore()

test('Visualization/Item renders view mode', async () => {
    const promise = Promise.resolve()

    const store = {
        itemFilters: {},
        itemActiveTypes: {},
        editDashboard: {},
        visualizations: {},
        slideshow: null,
    }

    const item = {
        type: 'VISUALIZATION',
        visualization: {
            id: 'fancychart',
            name: 'Fancy Chart',
            type: 'COLUMN',
        },
    }

    apiFetchVisualization.mockResolvedValue({
        id: 'fancychart',
        name: 'Fancy Chart',
        type: 'COLUMN',
    })
    const { container } = render(
        <Provider store={mockStore(store)}>
            <AppDataProvider>
                <WindowDimensionsProvider>
                    <Item item={item} dashboardMode="view" />
                </WindowDimensionsProvider>
            </AppDataProvider>
        </Provider>
    )

    await act(() => promise)
    expect(container).toMatchSnapshot()
})

test('Visualization/Item renders edit mode', async () => {
    const promise = Promise.resolve()

    const store = {
        itemFilters: {},
        itemActiveTypes: {},
        editDashboard: {
            id: 'fancychart',
        },
        visualizations: {},
    }

    const item = {
        type: 'VISUALIZATION',
        visualization: {
            id: 'fancychart',
            name: 'Fancy Chart',
        },
    }

    apiFetchVisualization.mockResolvedValue({
        id: 'fancychart',
        name: 'Fancy Chart',
        type: 'COLUMN',
    })
    const { container } = render(
        <Provider store={mockStore(store)}>
            <AppDataProvider>
                <WindowDimensionsProvider>
                    <Item item={item} dashboardMode="edit" />
                </WindowDimensionsProvider>
            </AppDataProvider>
        </Provider>
    )

    await act(() => promise)
    expect(container).toMatchSnapshot()
})
