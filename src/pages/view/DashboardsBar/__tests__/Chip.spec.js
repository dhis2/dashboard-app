import { useCacheableSection } from '@dhis2/app-service-offline'
import { render } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Router } from 'react-router-dom'
import Chip from '../Chip'

jest.mock('@dhis2/app-service-offline', () => ({
    useCacheableSection: jest.fn(),
}))

const mockOfflineDashboard = {
    lastUpdated: 'Jan 10',
    recording: false,
}

const mockNonOfflineDashboard = {
    lastUpdated: null,
    recording: false,
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

test('renders an unstarred chip for an non-offline dashboard', () => {
    useCacheableSection.mockImplementationOnce(() => mockNonOfflineDashboard)
    const { container } = render(
        <Router history={createMemoryHistory()}>
            <Chip {...defaultProps} />
        </Router>
    )

    expect(container).toMatchSnapshot()
})

test('renders an unstarred chip for an offline dashboard', () => {
    useCacheableSection.mockImplementationOnce(() => mockOfflineDashboard)
    const { container } = render(
        <Router history={createMemoryHistory()}>
            <Chip {...defaultProps} />
        </Router>
    )

    expect(container).toMatchSnapshot()
})

test('renders a starred chip for a non-offline dashboard', () => {
    useCacheableSection.mockImplementationOnce(() => mockNonOfflineDashboard)
    const props = Object.assign({}, defaultProps, { starred: true })
    const { container } = render(
        <Router history={createMemoryHistory()}>
            <Chip {...props} />
        </Router>
    )

    expect(container).toMatchSnapshot()
})

test('renders a starred chip for an offline dashboard', () => {
    useCacheableSection.mockImplementationOnce(() => mockOfflineDashboard)
    const props = Object.assign({}, defaultProps, { starred: true })
    const { container } = render(
        <Router history={createMemoryHistory()}>
            <Chip {...props} />
        </Router>
    )

    expect(container).toMatchSnapshot()
})

test('renders a starred, selected chip for non-offline dashboard', () => {
    useCacheableSection.mockImplementationOnce(() => mockNonOfflineDashboard)
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

test('renders a starred, selected chip for offline dashboard', () => {
    useCacheableSection.mockImplementationOnce(() => mockOfflineDashboard)
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

test('renders a starred, selected chip for offline dashboard that is recording', () => {
    useCacheableSection.mockImplementationOnce(() => ({
        lastUpdated: 'Jan 10',
        recording: true,
    }))
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
