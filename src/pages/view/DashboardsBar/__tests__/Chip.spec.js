import React from 'react'
import { render } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import Chip from '../Chip'

const defaultProps = {
    onClick: jest.fn(),
    label: 'Hello Rainbow Dash',
    dashboardId: 'myLittlePony',
}

test('Chip renders unstarred and unselected', () => {
    const { container } = render(
        <Router history={createMemoryHistory()}>
            <Chip {...defaultProps} starred={false} selected={false} />
        </Router>
    )
    expect(container).toMatchSnapshot()
})

test('Chip renders starred and unselected', () => {
    const { container } = render(
        <Router history={createMemoryHistory()}>
            <Chip {...defaultProps} starred={true} selected={false} />
        </Router>
    )
    expect(container).toMatchSnapshot()
})

test('Chip renders starred and selected', () => {
    const { container } = render(
        <Router history={createMemoryHistory()}>
            <Chip {...defaultProps} starred={true} selected={true} />
        </Router>
    )
    expect(container).toMatchSnapshot()
})

test('Chip renders unstarred and selected', () => {
    const { container } = render(
        <Router history={createMemoryHistory()}>
            <Chip {...defaultProps} starred={false} selected={true} />
        </Router>
    )
    expect(container).toMatchSnapshot()
})
