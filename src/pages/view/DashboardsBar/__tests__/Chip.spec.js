import React from 'react'
import { render } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import Chip from '../Chip'

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
    const { container } = render(
        <Router history={createMemoryHistory()}>
            <Chip {...defaultProps} />
        </Router>
    )

    expect(container).toMatchSnapshot()
})

test('renders an unstarred chip for an offline dashboard', () => {
    const { container } = render(
        <Router history={createMemoryHistory()}>
            <Chip {...defaultProps} />
        </Router>
    )

    expect(container).toMatchSnapshot()
})

test('renders a starred chip for a non-offline dashboard', () => {
    const props = Object.assign({}, defaultProps, { starred: true })
    const { container } = render(
        <Router history={createMemoryHistory()}>
            <Chip {...props} />
        </Router>
    )

    expect(container).toMatchSnapshot()
})

test('renders a starred chip for an offline dashboard', () => {
    const props = Object.assign({}, defaultProps, { starred: true })
    const { container } = render(
        <Router history={createMemoryHistory()}>
            <Chip {...props} />
        </Router>
    )

    expect(container).toMatchSnapshot()
})

test('renders a starred, selected chip for non-offline dashboard', () => {
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
