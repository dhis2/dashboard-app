import { render, waitFor, act } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'
import { NavigationMenu } from '../NavigationMenu.js'

jest.mock('@dhis2/app-runtime', () => ({
    useDataEngine: jest.fn(),
}))

jest.mock('../EndIntersectionDetector.js', () => {
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

jest.mock('../NavigationMenuItem.js', () => {
    return {
        NavigationMenuItem: ({ displayName }) => (
            <li role="menu-item">{displayName}</li>
        ),
    }
})

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

    it('requests the dashboards using the correct parameters', async () => {
        const { getAllByRole } = render(
            <Router history={createMemoryHistory()}>
                <NavigationMenu close={() => {}} hasDashboards={true} />
            </Router>
        )

        await waitFor(() => {
            expect(dataEngine.query).toHaveBeenCalledWith(
                { dashboards: expect.any(Object) },
                { variables: { page: 1, filterText: '' } }
            )
        })

        expect(getAllByRole('menu-item')).toHaveLength(5)
    })

    it('renders a notification if no dashboards are available', async () => {
        let getByText
        await act(async () => {
            const renderResult = render(
                <Router history={createMemoryHistory()}>
                    <NavigationMenu close={() => {}} hasDashboards={false} />
                </Router>
            )
            getByText = renderResult.getByText
        })

        expect(getByText('No dashboards available.')).toBeVisible()
        expect(
            getByText('Create a new dashboard using the + button.')
        ).toBeVisible()
    })
})
