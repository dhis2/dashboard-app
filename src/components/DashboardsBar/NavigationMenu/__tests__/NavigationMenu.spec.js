import { render } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { createStore } from 'redux'
import { NavigationMenu } from '../NavigationMenu.js'

jest.mock('../NavigationMenuItem.js', () => ({
    NavigationMenuItem: ({ displayName }) => (
        <li role="menu-item">{displayName}</li>
    ),
}))
const baseState = {
    dashboards: {
        nghVC4wtyzi: {
            id: 'nghVC4wtyzi',
            displayName: 'Antenatal Care',
            starred: true,
        },
        rmPiJIPFL4U: {
            displayName: 'Antenatal Care data',
            id: 'rmPiJIPFL4U',
            starred: false,
        },
        JW7RlN5xafN: {
            displayName: 'Cases Malaria',
            id: 'JW7RlN5xafN',
            starred: false,
        },
        iMnYyBfSxmM: {
            displayName: 'Delivery',
            id: 'iMnYyBfSxmM',
            starred: false,
        },
        vqh4MBWOTi4: {
            displayName: 'Disease Surveillance',
            id: 'vqh4MBWOTi4',
            starred: false,
        },
    },
    dashboardsFilter: '',
}

const createMockStore = (state) =>
    createStore(() => Object.assign({}, baseState, state))

test('renders a list of dashboard menu items', () => {
    const mockStore = createMockStore({})
    const { getAllByRole } = render(
        <Provider store={mockStore}>
            <Router history={createMemoryHistory()}>
                <NavigationMenu close={() => {}} />
            </Router>
        </Provider>
    )
    expect(getAllByRole('menu-item')).toHaveLength(5)
})

test('renders a notification if no dashboards are available', () => {
    const mockStore = createMockStore({ dashboards: {} })
    const { getByText } = render(
        <Provider store={mockStore}>
            <Router history={createMemoryHistory()}>
                <NavigationMenu close={() => {}} />
            </Router>
        </Provider>
    )

    expect(getByText('No dashboards available.')).toBeVisible()
    expect(
        getByText('Create a new dashboard using the + button.')
    ).toBeVisible()
})

test('renders a placeholder list item if no dashboards meet the filter criteria', () => {
    const filterStr = 'xxxxxxxxxxxxx'
    const mockStore = createMockStore({ dashboardsFilter: filterStr })
    const { getByText, getByPlaceholderText } = render(
        <Provider store={mockStore}>
            <Router history={createMemoryHistory()}>
                <NavigationMenu close={() => {}} />
            </Router>
        </Provider>
    )
    expect(getByPlaceholderText('Search for a dashboard')).toHaveValue(
        filterStr
    )
    expect(getByText('No dashboards found')).toBeVisible()
})
