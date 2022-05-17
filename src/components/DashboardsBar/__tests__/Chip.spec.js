import { useCacheableSection } from '@dhis2/app-runtime'
import { render } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'
import Chip from '../Chip.js'

jest.mock('@dhis2/app-runtime', () => ({
    useOnlineStatus: () => ({ online: true }),
    useCacheableSection: jest.fn(),
}))

jest.mock('@dhis2/app-runtime-adapter-d2', () => ({
    useD2: () => ({
        d2: {
            currentUser: {
                username: 'rainbowDash',
                id: 'r3nb0d5h',
            },
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

test('renders an unstarred chip for a non-offline dashboard', () => {
    useCacheableSection.mockImplementation(() => mockNonOfflineDashboard)
    const { container } = render(
        <Router history={createMemoryHistory()}>
            <Chip {...defaultProps} />
        </Router>
    )

    expect(container).toMatchSnapshot()
})

test('renders an unstarred chip for an offline dashboard', () => {
    useCacheableSection.mockImplementation(() => mockOfflineDashboard)
    const { container } = render(
        <Router history={createMemoryHistory()}>
            <Chip {...defaultProps} />
        </Router>
    )

    expect(container).toMatchSnapshot()
})

test('renders a starred chip for a non-cached dashboard', () => {
    useCacheableSection.mockImplementation(() => mockNonOfflineDashboard)
    const props = Object.assign({}, defaultProps, { starred: true })
    const { container } = render(
        <Router history={createMemoryHistory()}>
            <Chip {...props} />
        </Router>
    )

    expect(container).toMatchSnapshot()
})

test('renders a starred chip for a cached dashboard', () => {
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
