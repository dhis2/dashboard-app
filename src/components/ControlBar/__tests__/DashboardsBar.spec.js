import React from 'react'
import { render } from '@testing-library/react'
import { fireEvent } from '@testing-library/dom'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { Router } from 'react-router-dom'
import WindowDimensionsProvider from '../../WindowDimensionsProvider'
import { createMemoryHistory } from 'history'
import DashboardsBar, { MAX_ROW_COUNT } from '../DashboardsBar'
import { MIN_ROW_COUNT } from '../controlBarDimensions'
import * as api from '../../../api/controlBar'

// TODO this spy is an implementation detail
jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => cb())

const mockStore = configureMockStore()
const dashboards = {
    byId: {
        rainbow123: {
            id: 'rainbow123',
            displayName: 'Rainbow Dash',
            starred: false,
        },
        fluttershy123: {
            id: 'fluttershy123',
            displayName: 'Fluttershy',
            starred: true,
        },
    },
}

test('renders a DashboardsBar with minimum height', () => {
    const store = {
        dashboards,
        dashboardsFilter: '',
        controlBar: { userRows: MIN_ROW_COUNT },
        selected: { id: 'rainbow123' },
    }
    const { container } = render(
        <Provider store={mockStore(store)}>
            <WindowDimensionsProvider>
                <Router history={createMemoryHistory()}>
                    <DashboardsBar />
                </Router>
            </WindowDimensionsProvider>
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('renders a DashboardsBar with maximum height', () => {
    const store = {
        dashboards,
        dashboardsFilter: '',
        controlBar: { userRows: MAX_ROW_COUNT },
        selected: { id: 'rainbow123' },
    }
    const { container } = render(
        <Provider store={mockStore(store)}>
            <WindowDimensionsProvider>
                <Router history={createMemoryHistory()}>
                    <DashboardsBar />
                </Router>
            </WindowDimensionsProvider>
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test.skip('renders a DashboardsBar with selected item', () => {
    const store = {
        dashboards,
        dashboardsFilter: '',
        controlBar: { userRows: MIN_ROW_COUNT },
        selected: { id: 'fluttershy123' },
    }

    const { container } = render(
        <WindowDimensionsProvider>
            <Router history={createMemoryHistory()}>
                <Provider store={mockStore(store)}>
                    <DashboardsBar />
                </Provider>
            </Router>
        </WindowDimensionsProvider>
    )
    expect(container).toMatchSnapshot()
})

test('renders a DashboardsBar with no items', () => {
    const store = {
        dashboards: { byId: {} },
        dashboardsFilter: '',
        controlBar: { userRows: MIN_ROW_COUNT },
        selected: { id: 'rainbow123' },
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <WindowDimensionsProvider>
                <Router history={createMemoryHistory()}>
                    <DashboardsBar />
                </Router>
            </WindowDimensionsProvider>
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test.skip('clicking "Show more" maximizes dashboards bar height', () => {
    const store = {
        dashboards,
        dashboardsFilter: '',
        controlBar: { userRows: MIN_ROW_COUNT },
        selected: { id: 'fluttershy123' },
    }
    const { getByTitle, asFragment } = render(
        <Provider store={mockStore(store)}>
            <WindowDimensionsProvider>
                <Router history={createMemoryHistory()}>
                    <DashboardsBar />
                </Router>
            </WindowDimensionsProvider>
        </Provider>
    )

    fireEvent.click(getByTitle('Show more'))
    expect(asFragment()).toMatchSnapshot()
})

test('triggers onChangeHeight when controlbar height is changed', () => {
    const store = mockStore({
        dashboards,
        dashboardsFilter: '',
        controlBar: { userRows: MIN_ROW_COUNT },
        selected: { id: 'fluttershy123' },
    })
    const { getByTestId } = render(
        <Provider store={store}>
            <WindowDimensionsProvider>
                <Router history={createMemoryHistory()}>
                    <DashboardsBar />
                </Router>
            </WindowDimensionsProvider>
        </Provider>
    )

    const spy = jest.spyOn(api, 'apiPostControlBarRows')

    // TODO - these are implementation details! Refactor the component so this
    // isn't necessary to run the test
    fireEvent.mouseDown(getByTestId('controlbar-drag-handle'))
    fireEvent.mouseMove(window, { clientY: 777 })
    fireEvent.mouseUp(window)

    const actions = store.getActions()

    expect(actions.length).toEqual(1)
    expect(actions[0].type).toEqual('SET_CONTROLBAR_USER_ROWS')
    expect(actions[0].value).toEqual(10)

    spy.mockRestore()
})

test('does not trigger onChangeHeight when controlbar height is changed to similar value', () => {
    const store = mockStore({
        dashboards,
        dashboardsFilter: '',
        controlBar: { userRows: MIN_ROW_COUNT },
        selected: { id: 'fluttershy123' },
    })
    const { getByTestId } = render(
        <Provider store={store}>
            <WindowDimensionsProvider>
                <Router history={createMemoryHistory()}>
                    <DashboardsBar />
                </Router>
            </WindowDimensionsProvider>
        </Provider>
    )

    const spy = jest.spyOn(api, 'apiPostControlBarRows')

    // TODO - these are implementation details! Refactor the component so this
    // isn't necessary to run the test
    fireEvent.mouseDown(getByTestId('controlbar-drag-handle'))
    fireEvent.mouseMove(window, { clientY: 80 })
    fireEvent.mouseUp(window)

    const actions = store.getActions()

    expect(actions.length).toEqual(0)
    spy.mockRestore()
})

test('calls the api to post user rows when drag ends', () => {
    const store = {
        dashboards,
        dashboardsFilter: '',
        controlBar: { userRows: MIN_ROW_COUNT },
        selected: { id: 'rainbow123' },
    }
    const { getByTestId } = render(
        <Provider store={mockStore(store)}>
            <WindowDimensionsProvider>
                <Router history={createMemoryHistory()}>
                    <DashboardsBar />
                </Router>
            </WindowDimensionsProvider>
        </Provider>
    )

    const spy = jest.spyOn(api, 'apiPostControlBarRows')

    // TODO - these are implementation details! Refactor the component so this
    // isn't necessary to run the test
    fireEvent.mouseDown(getByTestId('controlbar-drag-handle'))
    fireEvent.mouseMove(window, { clientY: 333 })
    fireEvent.mouseUp(window)

    expect(spy).toHaveBeenCalledTimes(1)
    spy.mockRestore()
})
