import { render, screen, fireEvent } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { createStore } from 'redux'
import dashboardsFilter from '../../../../reducers/dashboardsFilter.js'
import { NavigationMenu } from '../NavigationMenu.jsx'

jest.mock('../../../AppDataProvider/AppDataProvider.jsx', () => ({
    useCurrentUser: () => ({ id: 'u1', username: 'rainbowdash' }),
}))

jest.mock('../NavigationMenuItem.jsx', () => ({
    NavigationMenuItem: (
        { displayName } // NOSONAR
    ) => <li role="presentation">{displayName}</li>, // NOSONAR
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
    recentDashboards: [],
}

const createMockStore = (state) =>
    createStore(() => ({ ...baseState, ...state }))

describe('NavigationMenu', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    test('renders a list of dashboard menu items', () => {
        const mockStore = createMockStore({})
        const { getAllByRole } = render(
            <Provider store={mockStore}>
                <Router history={createMemoryHistory()}>
                    <NavigationMenu close={() => {}} />
                </Router>
            </Provider>
        )
        expect(getAllByRole('presentation')).toHaveLength(5)
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
        expect(
            getByText(`No dashboards found for "${filterStr}"`)
        ).toBeVisible()
    })
})

const tabState = {
    dashboards: {
        a: {
            id: 'a',
            displayName: 'Antenatal',
            starred: true,
            createdBy: { id: 'u1' },
        },
        b: {
            id: 'b',
            displayName: 'Blood bank',
            starred: false,
            createdBy: { id: 'u2' },
        },
    },
    dashboardsFilter: '',
    recentDashboards: [],
}

const rootReducer = (s = tabState, action) => ({
    ...s,
    dashboardsFilter: dashboardsFilter(s.dashboardsFilter, action),
})

const renderMenu = () =>
    render(
        <Provider store={createStore(rootReducer)}>
            <NavigationMenu close={jest.fn()} />
        </Provider>
    )

describe('NavigationMenu tabs', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it('shows all dashboards on the default tab', () => {
        renderMenu()

        expect(screen.getByText('Antenatal')).toBeInTheDocument()
        expect(screen.getByText('Blood bank')).toBeInTheDocument()
    })

    it('shows only starred dashboards on the Starred tab', () => {
        renderMenu()

        fireEvent.click(screen.getByText('Starred'))

        expect(screen.getByText('Antenatal')).toBeInTheDocument()
        expect(screen.queryByText('Blood bank')).not.toBeInTheDocument()
    })

    it('shows only dashboards created by the current user on the Mine tab', () => {
        renderMenu()

        fireEvent.click(screen.getByText('Mine'))

        expect(screen.getByText('Antenatal')).toBeInTheDocument()
        expect(screen.queryByText('Blood bank')).not.toBeInTheDocument()
    })

    it('explains an empty Recent tab instead of showing a blank panel', () => {
        renderMenu()

        fireEvent.click(screen.getByText('Recent'))

        expect(
            screen.getByText('Dashboards you open will appear here.')
        ).toBeInTheDocument()
    })

    it('restores the tab the user last used', () => {
        const { unmount } = renderMenu()
        fireEvent.click(screen.getByText('Mine'))
        unmount()

        renderMenu()

        expect(screen.queryByText('Blood bank')).not.toBeInTheDocument()
    })

    it('shows the empty-tab message rather than no-results when both apply', () => {
        renderMenu()
        fireEvent.click(screen.getByText('Recent'))
        fireEvent.change(
            screen.getByPlaceholderText('Search for a dashboard'),
            {
                target: { value: 'zzz' },
            }
        )

        expect(
            screen.getByText('Dashboards you open will appear here.')
        ).toBeInTheDocument()
        expect(
            screen.queryByText(/No dashboards found for/)
        ).not.toBeInTheDocument()
    })

    it('offers matches from All when searching inside another tab', () => {
        renderMenu()
        fireEvent.click(screen.getByText('Starred'))
        fireEvent.change(
            screen.getByPlaceholderText('Search for a dashboard'),
            {
                target: { value: 'b' },
            }
        )

        expect(screen.getByText('1 more in All dashboards')).toBeInTheDocument()
    })

    it('offers matches from All even when the tab already has a result', () => {
        renderMenu()
        fireEvent.click(screen.getByText('Starred'))
        fireEvent.change(
            screen.getByPlaceholderText('Search for a dashboard'),
            {
                target: { value: 'a' },
            }
        )

        expect(screen.getByText('Antenatal')).toBeInTheDocument()
        expect(screen.getByText(/more in All dashboards/)).toBeInTheDocument()
    })

    it('shows the plural form when more than one match sits elsewhere', () => {
        const pluralState = {
            dashboards: {
                a: {
                    id: 'a',
                    displayName: 'Antenatal',
                    starred: true,
                    createdBy: { id: 'u1' },
                },
                b: {
                    id: 'b',
                    displayName: 'Blood bank',
                    starred: false,
                    createdBy: { id: 'u2' },
                },
                c: {
                    id: 'c',
                    displayName: 'Blood supply',
                    starred: false,
                    createdBy: { id: 'u2' },
                },
            },
            dashboardsFilter: '',
            recentDashboards: [],
        }
        const pluralReducer = (s = pluralState, action) => ({
            ...s,
            dashboardsFilter: dashboardsFilter(s.dashboardsFilter, action),
        })
        render(
            <Provider store={createStore(pluralReducer)}>
                <NavigationMenu close={jest.fn()} />
            </Provider>
        )

        fireEvent.click(screen.getByText('Starred'))
        fireEvent.change(
            screen.getByPlaceholderText('Search for a dashboard'),
            {
                target: { value: 'blood' },
            }
        )

        expect(screen.getByText('2 more in All dashboards')).toBeInTheDocument()
    })

    it('switches to All when the hint is clicked', () => {
        renderMenu()
        fireEvent.click(screen.getByText('Starred'))
        fireEvent.change(
            screen.getByPlaceholderText('Search for a dashboard'),
            {
                target: { value: 'b' },
            }
        )
        fireEvent.click(screen.getByText('1 more in All dashboards'))

        expect(screen.getByText('Blood bank')).toBeInTheDocument()
    })

    it('shows no hint on the All tab', () => {
        renderMenu()
        fireEvent.change(
            screen.getByPlaceholderText('Search for a dashboard'),
            {
                target: { value: 'b' },
            }
        )

        expect(
            screen.queryByText(/more in All dashboards/)
        ).not.toBeInTheDocument()
    })
})
