import { useOnlineStatus } from '@dhis2/app-runtime'
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
    useOnlineStatus: jest.fn(() => ({ online: true, offline: false })),
}))

const offline = {
    online: false,
    offline: true,
}

const online = {
    online: true,
    offline: false,
}

const defaultProps = {
    onActiveTypeChanged: jest.fn(),
}

test('renders menu for active type MAP and type CHART', async () => {
    useOnlineStatus.mockImplementation(jest.fn(() => online))
    const props = Object.assign({}, defaultProps, {
        type: CHART,
        activeType: MAP,
    })

    const { container } = render(<ViewAsMenuItems {...props} />)

    expect(container).toMatchSnapshot()
})

test('renders disabled menu items when offline', () => {
    useOnlineStatus.mockImplementation(jest.fn(() => offline))

    const props = Object.assign({}, defaultProps, {
        type: CHART,
        activeType: MAP,
    })

    const { container } = render(<ViewAsMenuItems {...props} />)
    expect(container).toMatchSnapshot()
})

test('renders menu for active type CHART and type MAP', async () => {
    useOnlineStatus.mockImplementation(jest.fn(() => online))
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
    useOnlineStatus.mockImplementation(jest.fn(() => online))
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
    useOnlineStatus.mockImplementation(jest.fn(() => offline))
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
    useOnlineStatus.mockImplementation(jest.fn(() => online))
    const props = Object.assign({}, defaultProps, {
        type: CHART,
        activeType: REPORT_TABLE,
        visualization: {},
    })

    const { container } = render(<ViewAsMenuItems {...props} />)

    expect(container).toMatchSnapshot()
})

test('renders menu for active type CHART and type REPORT_TABLE', async () => {
    useOnlineStatus.mockImplementation(jest.fn(() => online))
    const props = Object.assign({}, defaultProps, {
        type: REPORT_TABLE,
        activeType: CHART,
        visualization: {},
    })

    const { container } = render(<ViewAsMenuItems {...props} />)

    expect(container).toMatchSnapshot()
})

test('renders menu for active type EVENT_REPORT and type EVENT_CHART', async () => {
    useOnlineStatus.mockImplementation(jest.fn(() => online))
    const props = Object.assign({}, defaultProps, {
        type: EVENT_CHART,
        activeType: EVENT_REPORT,
        visualization: {},
    })

    const { container } = render(<ViewAsMenuItems {...props} />)

    expect(container).toMatchSnapshot()
})

test('renders menu for active type EVENT_CHART and type EVENT_REPORT', async () => {
    useOnlineStatus.mockImplementation(jest.fn(() => online))
    const props = Object.assign({}, defaultProps, {
        type: EVENT_REPORT,
        activeType: EVENT_CHART,
        visualization: {},
    })

    const { container } = render(<ViewAsMenuItems {...props} />)

    expect(container).toMatchSnapshot()
})
