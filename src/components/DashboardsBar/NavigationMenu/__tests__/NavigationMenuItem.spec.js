import {
    useCacheableSection,
    useDhis2ConnectionStatus,
} from '@dhis2/app-runtime'
import { render, fireEvent } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router, useHistory } from 'react-router-dom'
import { createStore } from 'redux'
import { apiPostDataStatistics } from '../../../../api/dataStatistics.js'
import { NavigationMenuItem } from '../NavigationMenuItem.js'

jest.mock('@dhis2/app-runtime', () => ({
    useDhis2ConnectionStatus: jest.fn(() => ({ isConnected: true })),
    useCacheableSection: jest.fn(),
    useDataEngine: jest.fn(),
}))

jest.mock('@dhis2/analytics', () => ({
    useCachedDataQuery: () => ({
        currentUser: {
            username: 'rainbowDash',
            id: 'r3nb0d5h',
        },
    }),
}))

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: jest.fn(),
}))

jest.mock('../../../../api/dataStatistics.js', () => ({
    apiPostDataStatistics: jest.fn(),
}))

const mockOfflineDashboard = {
    lastUpdated: 'Jan 10',
}

const mockNonOfflineDashboard = {
    lastUpdated: null,
}

const defaultProps = {
    starred: false,
    displayName: 'Rainbow Dash',
    id: 'rainbowdash',
    close: Function.prototype,
}

const selectedId = 'theselectedid'

const defaultStoreFn = () => ({
    selected: {
        id: selectedId,
    },
})

test('renders an inactive MenuItem for a dashboard', () => {
    useCacheableSection.mockImplementation(() => mockNonOfflineDashboard)
    const mockStore = createStore(defaultStoreFn)
    const { container } = render(
        <Provider store={mockStore}>
            <Router history={createMemoryHistory()}>
                <NavigationMenuItem {...defaultProps} />
            </Router>
        </Provider>
    )
    expect(container.querySelector('.container').childNodes).toHaveLength(1)
})

test('renders an inactive MenuItem with a star icon, for a starred dashboard', () => {
    useCacheableSection.mockImplementation(() => mockNonOfflineDashboard)
    const mockStore = createStore(defaultStoreFn)
    const { container, getByTestId } = render(
        <Provider store={mockStore}>
            <Router history={createMemoryHistory()}>
                <NavigationMenuItem {...defaultProps} starred={true} />
            </Router>
        </Provider>
    )

    expect(container.querySelector('.container').childNodes).toHaveLength(2)
    expect(getByTestId('starred-dashboard')).toBeVisible()
})

test('renders an inactive MenuItem with an offline icon for a cached dashboard', () => {
    useCacheableSection.mockImplementation(() => mockOfflineDashboard)
    const mockStore = createStore(defaultStoreFn)
    const { getByTestId, container } = render(
        <Provider store={mockStore}>
            <Router history={createMemoryHistory()}>
                <NavigationMenuItem {...defaultProps} />
            </Router>
        </Provider>
    )
    expect(container.querySelector('.container').childNodes).toHaveLength(2)
    expect(getByTestId('dashboard-saved-offline')).toBeVisible()
})

test('renders an active MenuItem for the currently selected dashboard', () => {
    useCacheableSection.mockImplementation(() => mockNonOfflineDashboard)
    const mockStore = createStore(defaultStoreFn)
    const { getByTestId, container } = render(
        <Provider store={mockStore}>
            <Router history={createMemoryHistory()}>
                <NavigationMenuItem {...defaultProps} id={selectedId} />
            </Router>
        </Provider>
    )

    expect(container.querySelector('.container').childNodes).toHaveLength(1)
    expect(getByTestId('dhis2-uicore-menuitem')).toBeVisible()
})

test('Navigates to the related menu item when an item is clicked', () => {
    useCacheableSection.mockImplementation(() => mockNonOfflineDashboard)
    const historyPushMock = jest.fn()
    useHistory.mockImplementation(() => ({
        push: historyPushMock,
    }))
    const mockStore = createStore(defaultStoreFn)
    const { getByText } = render(
        <Provider store={mockStore}>
            <Router history={createMemoryHistory()}>
                <NavigationMenuItem {...defaultProps} />
            </Router>
        </Provider>
    )
    fireEvent.click(getByText(defaultProps.displayName))
    expect(historyPushMock).toHaveBeenCalledTimes(1)
    expect(historyPushMock).toHaveBeenCalledWith(`/${defaultProps.id}`)
})

test('Closes the navigation menu if current dashboard is clicked', () => {
    useCacheableSection.mockImplementation(() => mockNonOfflineDashboard)
    const historyPushMock = jest.fn()
    useHistory.mockImplementation(() => ({
        push: historyPushMock,
    }))
    const mockStore = createStore(defaultStoreFn)
    const props = {
        ...defaultProps,
        id: selectedId,
        close: jest.fn(),
    }
    const { getByText } = render(
        <Provider store={mockStore}>
            <Router history={createMemoryHistory()}>
                <NavigationMenuItem {...props} />
            </Router>
        </Provider>
    )
    fireEvent.click(getByText(defaultProps.displayName))
    expect(historyPushMock).toHaveBeenCalledTimes(1)
    expect(historyPushMock).toHaveBeenCalledWith(`/${selectedId}`)
    expect(props.close).toHaveBeenCalledTimes(1)
})

it('Posts data statistics if connected', () => {
    jest.useFakeTimers()
    const apiPostDataStatisticsMock = jest.fn()
    apiPostDataStatistics.mockImplementation(apiPostDataStatisticsMock)
    const mockStore = createStore(defaultStoreFn)
    const { getByText } = render(
        <Provider store={mockStore}>
            <Router history={createMemoryHistory()}>
                <NavigationMenuItem {...defaultProps} />
            </Router>
        </Provider>
    )
    fireEvent.click(getByText(defaultProps.displayName))
    jest.runAllTimers()
    expect(apiPostDataStatisticsMock).toHaveBeenCalledWith(
        'DASHBOARD_VIEW',
        'rainbowdash',
        undefined
    )
})

it('Does not post data statistics if not connected', async () => {
    useDhis2ConnectionStatus.mockReturnValue({ isConnected: false })
    const historyPushMock = jest.fn()
    useHistory.mockImplementation(() => ({
        push: historyPushMock,
    }))
    jest.useFakeTimers()
    const apiPostDataStatisticsMock = jest.fn()
    apiPostDataStatistics.mockImplementation(apiPostDataStatisticsMock)
    const mockStore = createStore(defaultStoreFn)
    const { getByText } = render(
        <Provider store={mockStore}>
            <Router history={createMemoryHistory()}>
                <NavigationMenuItem {...defaultProps} />
            </Router>
        </Provider>
    )
    fireEvent.click(getByText(defaultProps.displayName))
    jest.runAllTimers()
    expect(apiPostDataStatisticsMock).not.toHaveBeenCalled()
    // Navigation should still work
    expect(historyPushMock).toHaveBeenCalledTimes(1)
    expect(historyPushMock).toHaveBeenCalledWith(`/${defaultProps.id}`)
})
