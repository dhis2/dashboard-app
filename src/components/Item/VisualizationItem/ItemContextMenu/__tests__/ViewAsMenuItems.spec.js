import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import { render } from '@testing-library/react'
import React from 'react'
import {
    REPORT_TABLE,
    MAP,
    CHART,
    EVENT_REPORT,
    EVENT_CHART,
} from '../../../../../modules/itemTypes.js'
import ViewAsMenuItems from '../ViewAsMenuItems.js'

jest.mock('@dhis2/app-runtime', () => ({
    useDhis2ConnectionStatus: jest.fn(() => ({
        isConnected: true,
        isDisconnected: false,
    })),
}))

const offline = {
    isConnected: false,
    isDisconnected: true,
}

const online = {
    isConnected: true,
    isDisconnected: false,
}

const defaultProps = {
    onActiveTypeChanged: jest.fn(),
}

test('renders menu for active type MAP and type CHART', async () => {
    useDhis2ConnectionStatus.mockImplementation(jest.fn(() => online))
    const props = Object.assign({}, defaultProps, {
        type: CHART,
        activeType: MAP,
        visualization: {
            type: 'COLUMN',
        },
    })

    const { container } = render(<ViewAsMenuItems {...props} />)

    expect(container).toMatchSnapshot()
})

test('renders disabled menu items when offline', () => {
    useDhis2ConnectionStatus.mockImplementation(jest.fn(() => offline))

    const props = Object.assign({}, defaultProps, {
        type: CHART,
        activeType: MAP,
        visualization: {
            type: 'COLUMN',
        },
    })

    const { container } = render(<ViewAsMenuItems {...props} />)
    expect(container).toMatchSnapshot()
})

test('renders menu for active type CHART and type MAP', async () => {
    useDhis2ConnectionStatus.mockImplementation(jest.fn(() => online))
    const props = Object.assign({}, defaultProps, {
        type: MAP,
        activeType: CHART,
        visualization: {
            mapViews: [{ layer: 'thematic' }],
        },
    })

    const { container } = render(<ViewAsMenuItems {...props} />)

    expect(container).toMatchSnapshot()
})

test('renders menu for active type MAP and type MAP without Thematic layer', async () => {
    useDhis2ConnectionStatus.mockImplementation(jest.fn(() => online))
    const props = Object.assign({}, defaultProps, {
        type: MAP,
        activeType: MAP,
        visualization: {
            mapViews: [{ layer: 'earthEngine' }],
        },
    })

    const { container } = render(<ViewAsMenuItems {...props} />)

    expect(container).toMatchSnapshot()
})

test('renders menu for active type MAP and type MAP without Thematic layer when offline', async () => {
    useDhis2ConnectionStatus.mockImplementation(jest.fn(() => offline))
    const props = Object.assign({}, defaultProps, {
        type: MAP,
        activeType: MAP,
        visualization: {
            mapViews: [{ layer: 'earthEngine' }],
        },
    })

    const { container } = render(<ViewAsMenuItems {...props} />)

    expect(container).toMatchSnapshot()
})

test('renders menu for active type REPORT_TABLE and type CHART', async () => {
    useDhis2ConnectionStatus.mockImplementation(jest.fn(() => online))
    const props = Object.assign({}, defaultProps, {
        type: CHART,
        activeType: REPORT_TABLE,
        visualization: { type: 'COLUMN' },
    })

    const { container } = render(<ViewAsMenuItems {...props} />)

    expect(container).toMatchSnapshot()
})

test('renders menu for active type CHART and type REPORT_TABLE', async () => {
    useDhis2ConnectionStatus.mockImplementation(jest.fn(() => online))
    const props = Object.assign({}, defaultProps, {
        type: REPORT_TABLE,
        activeType: CHART,
        visualization: { type: 'PIVOT_TABLE' },
    })

    const { container } = render(<ViewAsMenuItems {...props} />)

    expect(container).toMatchSnapshot()
})

test('renders menu for active type EVENT_REPORT and type EVENT_CHART', async () => {
    useDhis2ConnectionStatus.mockImplementation(jest.fn(() => online))
    const props = Object.assign({}, defaultProps, {
        type: EVENT_CHART,
        activeType: EVENT_REPORT,
        visualization: {},
    })

    const { container } = render(<ViewAsMenuItems {...props} />)

    expect(container).toMatchSnapshot()
})

test('renders menu for active type EVENT_CHART and type EVENT_REPORT', async () => {
    useDhis2ConnectionStatus.mockImplementation(jest.fn(() => online))
    const props = Object.assign({}, defaultProps, {
        type: EVENT_REPORT,
        activeType: EVENT_CHART,
        visualization: {},
    })

    const { container } = render(<ViewAsMenuItems {...props} />)

    expect(container).toMatchSnapshot()
})
