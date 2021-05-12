import React from 'react'
import { render } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import Item from '../Item'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import WindowDimensionsProvider from '../../../WindowDimensionsProvider'
import SystemSettingsProvider from '../../../SystemSettingsProvider'
import { apiFetchVisualization } from '../../../../api/fetchVisualization'

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
                    item={props.item} //eslint-disable-line react/prop-types
                    activetype={props.activeType} //eslint-disable-line react/prop-types
                    itemfilters={props.itemFilters} //eslint-disable-line react/prop-types
                    availableheight={props.availableheight} //eslint-disable-line react/prop-types
                    availablewidth={props.availablewidth} //eslint-disable-line react/prop-types
                    gridwidth={props.gridWidth} //eslint-disable-line react/prop-types
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
        type: 'CHART',
        chart: {
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
        type: 'CHART',
        chart: {
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
