import { render, act } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { apiFetchVisualization } from '../../../../api/fetchVisualization.js'
import SystemSettingsProvider from '../../../SystemSettingsProvider.js'
import WindowDimensionsProvider from '../../../WindowDimensionsProvider.js'
import Item from '../Item.js'

jest.mock('../../../../api/fetchVisualization')
jest.mock('../../../SystemSettingsProvider')
jest.mock('../Visualization/plugin', () => {
    return {
        pluginIsAvailable: () => true,
    }
})

jest.mock(
    '../../ItemHeader/DeleteItemButton.js',
    () =>
        function Mock() {
            return <div className="DeleteItemButton" />
        }
)

jest.mock(
    '../Visualization/Visualization',
    () =>
        function MockVisualizationComponent(props) {
            return (
                <div
                    className="visualization"
                    item={props.item}
                    activetype={props.activeType}
                    itemfilters={props.itemFilters}
                    availableheight={props.availableheight}
                    availablewidth={props.availablewidth}
                    gridwidth={props.gridWidth}
                />
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
            <SystemSettingsProvider>
                <WindowDimensionsProvider>
                    <Item item={item} dashboardMode="view" />
                </WindowDimensionsProvider>
            </SystemSettingsProvider>
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
            <SystemSettingsProvider>
                <WindowDimensionsProvider>
                    <Item item={item} dashboardMode="edit" />
                </WindowDimensionsProvider>
            </SystemSettingsProvider>
        </Provider>
    )

    await act(() => promise)
    expect(container).toMatchSnapshot()
})
