import { render, waitFor, act } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import { NavigationMenu } from '../NavigationMenu.jsx'

jest.mock('@dhis2/app-runtime', () => ({
    useDataEngine: jest.fn(),
    useDhis2ConnectionStatus: jest.fn(() => ({ isDisconnected: false })),
}))

jest.mock('../EndIntersectionDetector.jsx', () => {
    const React = require('react')
    const PropTypes = require('prop-types')
    const EndIntersectionDetector = ({ onEndReached }) => {
        // Simulate intersection
        React.useEffect(() => {
            onEndReached()
        }, [onEndReached])
        return <div className="MockEndIntersectionDetector" />
    }
    EndIntersectionDetector.propTypes = {
        onEndReached: PropTypes.func.isRequired,
    }
    return { EndIntersectionDetector }
})

jest.mock('../NavigationMenuItem.jsx', () => ({
    NavigationMenuItem: (
        { displayName } // NOSONAR
    ) => <li role="presentation">{displayName}</li>, // NOSONAR
}))

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

const mockStore = configureStore([])
const store = mockStore({})

describe('NavigationMenu', () => {
    let dataEngine

    beforeEach(() => {
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

    it('renders NavigationMenuItems after fetching dashboards', async () => {
        const { getAllByRole } = render(
            <Provider store={store}>
                <Router history={createMemoryHistory()}>
                    <NavigationMenu close={() => {}} hasDashboards={true} />
                </Router>
            </Provider>
        )

        await waitFor(() => {
            expect(getAllByRole('presentation')).toHaveLength(5)
        })
    })

    it('renders a notification if no dashboards are available', async () => {
        let getByText
        await act(async () => {
            const renderResult = render(
                <Provider store={store}>
                    <Router history={createMemoryHistory()}>
                        <NavigationMenu
                            close={() => {}}
                            hasDashboards={false}
                        />
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
})
