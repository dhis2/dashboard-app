import React from 'react'
import { render } from '@testing-library/react'
import ViewAsMenuItems from '../ViewAsMenuItems'
import {
    REPORT_TABLE,
    MAP,
    CHART,
    EVENT_REPORT,
    EVENT_CHART,
} from '../../../../../modules/itemTypes'

const defaultProps = {
    onActiveTypeChanged: jest.fn(),
}

test('renders menu for active type MAP and type CHART', async () => {
    const props = Object.assign({}, defaultProps, {
        type: CHART,
        activeType: MAP,
    })

    const { container } = render(<ViewAsMenuItems {...props} />)

    expect(container).toMatchSnapshot()
})

test('renders menu for active type CHART and type MAP', async () => {
    const props = Object.assign({}, defaultProps, {
        type: MAP,
        activeType: CHART,
    })

    const { container } = render(<ViewAsMenuItems {...props} />)

    expect(container).toMatchSnapshot()
})

test('renders menu for active type REPORT_TABLE and type CHART', async () => {
    const props = Object.assign({}, defaultProps, {
        type: CHART,
        activeType: REPORT_TABLE,
    })

    const { container } = render(<ViewAsMenuItems {...props} />)

    expect(container).toMatchSnapshot()
})

test('renders menu for active type CHART and type REPORT_TABLE', async () => {
    const props = Object.assign({}, defaultProps, {
        type: REPORT_TABLE,
        activeType: CHART,
    })

    const { container } = render(<ViewAsMenuItems {...props} />)

    expect(container).toMatchSnapshot()
})

test('renders menu for active type EVENT_REPORT and type EVENT_CHART', async () => {
    const props = Object.assign({}, defaultProps, {
        type: EVENT_CHART,
        activeType: EVENT_REPORT,
    })

    const { container } = render(<ViewAsMenuItems {...props} />)

    expect(container).toMatchSnapshot()
})

test('renders menu for active type EVENT_CHART and type EVENT_REPORT', async () => {
    const props = Object.assign({}, defaultProps, {
        type: EVENT_REPORT,
        activeType: EVENT_CHART,
    })

    const { container } = render(<ViewAsMenuItems {...props} />)

    expect(container).toMatchSnapshot()
})
