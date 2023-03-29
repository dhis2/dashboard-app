import { render } from '@testing-library/react'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { apiFetchVisualization } from '../../../../api/fetchVisualization'
import SystemSettingsProvider from '../../../SystemSettingsProvider'
import WindowDimensionsProvider from '../../../WindowDimensionsProvider'
import Item from '../Item'

jest.mock('../../../../api/fetchVisualization')
jest.mock('../../../SystemSettingsProvider')
jest.mock('../Visualization/plugin', () => {
    return {
        pluginIsAvailable: () => true,
    }
})

jest.mock(
    '../Visualization/Visualization',
    () =>
        function MockVisualizationComponent(props) {
            return (
                <div
                    className="visualization"
                    /* eslint-disable react/prop-types, react/no-unknown-property */
                    item={props.item}
                    activetype={props.activeType}
                    itemfilters={props.itemFilters}
                    availableheight={props.availableheight}
                    availablewidth={props.availablewidth}
                    gridwidth={props.gridWidth}
                    /* eslint-enable react/prop-types, react/no-unknown-property */
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
