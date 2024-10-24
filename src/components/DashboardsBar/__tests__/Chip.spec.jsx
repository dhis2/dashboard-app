import { useCacheableSection } from '@dhis2/app-runtime'
import { render } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'
import Chip from '../Chip.jsx'

/* eslint-disable react/prop-types */
jest.mock('@dhis2/ui', () => {
    const originalModule = jest.requireActual('@dhis2/ui')

    return {
        __esModule: true,
        ...originalModule,
        Chip: function Mock({ children, icon, selected }) {
            const componentProps = {
                starred: icon ? 'yes' : 'no',
                isselected: selected ? 'yes' : 'no',
            }

            return (
                <div className="mock-ui-Chip" {...componentProps}>
                    {children}
                </div>
            )
        },
    }
})
/* eslint-enable react/prop-types */

jest.mock('@dhis2/app-runtime', () => ({
    useDhis2ConnectionStatus: () => ({ isConnected: true }),
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

const mockOfflineDashboard = {
    lastUpdated: 'Jan 10',
}

const mockNonOfflineDashboard = {
    lastUpdated: null,
}

const defaultProps = {
    starred: false,
    selected: false,
    onClick: jest.fn(),
    label: 'Rainbow Dash',
    dashboardId: 'rainbowdash',
    classes: {
        icon: 'iconClass',
        selected: 'selectedClass',
        unselected: 'unselectedClass',
    },
}

test('renders an unstarred, unselected chip for a non-cached dashboard', () => {
    useCacheableSection.mockImplementation(() => mockNonOfflineDashboard)
    const { container } = render(
        <Router history={createMemoryHistory()}>
            <Chip {...defaultProps} />
        </Router>
    )

    expect(container).toMatchSnapshot()
})

test('renders an unstarred, unselected chip for cached dashboard', () => {
    useCacheableSection.mockImplementation(() => mockOfflineDashboard)
    const { container } = render(
        <Router history={createMemoryHistory()}>
            <Chip {...defaultProps} />
        </Router>
    )

    expect(container).toMatchSnapshot()
})

test('renders a starred, unselected chip for a non-cached dashboard', () => {
    useCacheableSection.mockImplementation(() => mockNonOfflineDashboard)
    const props = Object.assign({}, defaultProps, { starred: true })
    const { container } = render(
        <Router history={createMemoryHistory()}>
            <Chip {...props} />
        </Router>
    )

    expect(container).toMatchSnapshot()
})

test('renders a starred, unselected chip for a cached dashboard', () => {
    useCacheableSection.mockImplementation(() => mockOfflineDashboard)
    const props = Object.assign({}, defaultProps, { starred: true })
    const { container } = render(
        <Router history={createMemoryHistory()}>
            <Chip {...props} />
        </Router>
    )

    expect(container).toMatchSnapshot()
})

test('renders a starred, selected chip for non-cached dashboard', () => {
    useCacheableSection.mockImplementation(() => mockNonOfflineDashboard)
    const props = Object.assign({}, defaultProps, {
        starred: true,
        selected: true,
    })
    const { container } = render(
        <Router history={createMemoryHistory()}>
            <Chip {...props} />
        </Router>
    )

    expect(container).toMatchSnapshot()
})

test('renders a starred, selected chip for a cached dashboard', () => {
    useCacheableSection.mockImplementation(() => mockOfflineDashboard)
    const props = Object.assign({}, defaultProps, {
        starred: true,
        selected: true,
    })
    const { container } = render(
        <Router history={createMemoryHistory()}>
            <Chip {...props} />
        </Router>
    )

    expect(container).toMatchSnapshot()
})
