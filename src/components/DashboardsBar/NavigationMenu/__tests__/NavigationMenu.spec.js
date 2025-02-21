import { render, waitFor, act } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { createStore } from 'redux'
import { NavigationMenu } from '../NavigationMenu.js'

jest.mock('@dhis2/app-runtime', () => ({
    useDataEngine: jest.fn(),
}))

jest.mock('../../../../actions/dashboardsFilter', () => ({
    acSetDashboardsFilter: jest.fn(),
}))

jest.mock('../EndIntersectionDetector.js', () => {
    const React = require('react')
    return {
        EndIntersectionDetector: ({ onEndReached }) => {
            // Simulate intersection
            React.useEffect(() => {
                onEndReached()
            }, [onEndReached])
            return <div className="MockEndIntersectionDetector" />
        },
    }
})

jest.mock('../NavigationMenuItem.js', () => {
    const React = require('react')
    return {
        NavigationMenuItem: ({ displayName }) => (
            <li role="menu-item">{displayName}</li>
        ),
    }
})

const baseState = {
    dashboardsFilter: '',
}

const dashboards = {
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
}

const createMockStore = (state) =>
    createStore(() => ({ ...baseState, ...state }))

describe('NavigationMenu', () => {
    let store
    let dataEngine

    beforeEach(() => {
        store = createMockStore({})
        dataEngine = {
            query: jest.fn().mockResolvedValue({
                dashboards: {
                    dashboards: Object.values(dashboards),
                    pager: {
                        page: 1,
                        nextPage: null,
                    },
                },
            }),
        }
        require('@dhis2/app-runtime').useDataEngine.mockReturnValue(dataEngine)
    })

    it('requests the dashboards using the correct parameters', async () => {
        const { getAllByRole } = render(
            <Provider store={store}>
                <Router history={createMemoryHistory()}>
                    <NavigationMenu close={() => {}} />
                </Router>
            </Provider>
        )

        await waitFor(() => {
            expect(dataEngine.query).toHaveBeenCalledWith(
                { dashboards: expect.any(Object) },
                { variables: { page: 1, searchTerm: '' } }
            )
        })

        expect(getAllByRole('menu-item')).toHaveLength(5)
    })

    it('renders a notification if no dashboards are available', async () => {
        const mockStore = createMockStore({ dashboards: {} })
        dataEngine.query.mockResolvedValueOnce({
            dashboards: {
                dashboards: [],
                pager: {
                    page: 1,
                    nextPage: null,
                },
            },
        })

        let getByText
        await act(async () => {
            const renderResult = render(
                <Provider store={mockStore}>
                    <Router history={createMemoryHistory()}>
                        <NavigationMenu close={() => {}} />
                    </Router>
                </Provider>
            )
            getByText = renderResult.getByText
        })

        expect(getByText('No dashboards available.')).toBeVisible()
        expect(
            getByText('Create a new dashboard using the + button.')
        ).toBeVisible()
    })

    it.skip('renders a placeholder list item if no dashboards meet the filter criteria', async () => {
        const filterStr = 'xxxxxxxxxxxxx'
        const mockStore = createMockStore({ dashboardsFilter: filterStr })

        // dataEngine.query.mockResolvedValueOnce({
        //     dashboards: {
        //         dashboards: [],
        //         pager: {
        //             page: 1,
        //             nextPage: null,
        //         },
        //     },
        // })
        dataEngine = {
            query: jest
                .fn()
                .mockResolvedValueOnce({
                    dashboards: {
                        dashboards: Object.values(dashboards),
                        pager: {
                            page: 1,
                            nextPage: null,
                        },
                    },
                })
                .mockResolvedValueOnce({
                    dashboards: {
                        dashboards: [],
                        pager: {
                            page: 1,
                            nextPage: null,
                        },
                    },
                }),
        }

        let getByText, getByPlaceholderText

        await act(async () => {
            const renderResult = render(
                <Provider store={mockStore}>
                    <Router history={createMemoryHistory()}>
                        <NavigationMenu close={() => {}} />
                    </Router>
                </Provider>
            )
            getByText = renderResult.getByText
            getByPlaceholderText = renderResult.getByPlaceholderText
        })

        expect(getByPlaceholderText('Search for a dashboard')).toHaveValue(
            filterStr
        )
        expect(
            getByText(`No dashboards found for "${filterStr}"`)
        ).toBeVisible()
    })
})
