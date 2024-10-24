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
import ViewAsMenuItems from '../ViewAsMenuItems.jsx'

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
        activeType: MAP,
        type: CHART,
        visualization: {
            type: 'COLUMN',
        },
    })

    const { queryByText } = render(<ViewAsMenuItems {...props} />)

    expect(queryByText('View as Map')).toBeNull()
    expect(queryByText('View as Chart')).toBeTruthy()
    expect(queryByText('View as Pivot table')).toBeTruthy()
})

test('renders menu for active type CHART and type MAP', async () => {
    useDhis2ConnectionStatus.mockImplementation(jest.fn(() => online))
    const props = Object.assign({}, defaultProps, {
        activeType: CHART,
        type: MAP,
        visualization: {
            mapViews: [{ layer: 'thematic' }],
        },
    })

    const { queryByText } = render(<ViewAsMenuItems {...props} />)

    expect(queryByText('View as Map')).toBeTruthy()
    expect(queryByText('View as Chart')).toBeNull()
    expect(queryByText('View as Pivot table')).toBeTruthy()
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

    const listItems = container.querySelectorAll('li')
    listItems.forEach((listItem) => {
        expect(listItem.getAttribute('class')).toContain('disabled')
    })
})

test('renders menu for active type MAP and type MAP without Thematic layer', async () => {
    useDhis2ConnectionStatus.mockImplementation(jest.fn(() => online))
    const props = Object.assign({}, defaultProps, {
        activeType: MAP,
        type: MAP,
        visualization: {
            mapViews: [{ layer: 'earthEngine' }],
        },
    })

    const { container, queryByText } = render(<ViewAsMenuItems {...props} />)

    expect(queryByText('View as Map')).toBeNull()
    expect(queryByText('View as Chart')).toBeTruthy()
    expect(queryByText('View as Pivot table')).toBeTruthy()

    const listItems = container.querySelectorAll('li')
    expect(listItems).toHaveLength(2)
    listItems.forEach((listItem) => {
        expect(listItem.getAttribute('class')).toContain('disabled')
    })
})

test('renders menu for active type MAP and type MAP without Thematic layer when offline', async () => {
    useDhis2ConnectionStatus.mockImplementation(jest.fn(() => offline))
    const props = Object.assign({}, defaultProps, {
        activeType: MAP,
        type: MAP,
        visualization: {
            mapViews: [{ layer: 'earthEngine' }],
        },
    })

    const { container, queryByText } = render(<ViewAsMenuItems {...props} />)

    expect(queryByText('View as Map')).toBeNull()
    expect(queryByText('View as Chart')).toBeTruthy()
    expect(queryByText('View as Pivot table')).toBeTruthy()

    const listItems = container.querySelectorAll('li')
    expect(listItems).toHaveLength(2)
    listItems.forEach((listItem) => {
        expect(listItem.getAttribute('class')).toContain('disabled')
    })
})

test('renders menu for active type REPORT_TABLE and type CHART', async () => {
    useDhis2ConnectionStatus.mockImplementation(jest.fn(() => online))
    const props = Object.assign({}, defaultProps, {
        activeType: REPORT_TABLE,
        type: CHART,
        visualization: { type: 'COLUMN' },
    })

    const { queryByText } = render(<ViewAsMenuItems {...props} />)

    expect(queryByText('View as Map')).toBeTruthy()
    expect(queryByText('View as Chart')).toBeTruthy()
    expect(queryByText('View as Pivot table')).toBeNull()
})

test('renders menu for active type CHART and type REPORT_TABLE', async () => {
    useDhis2ConnectionStatus.mockImplementation(jest.fn(() => online))
    const props = Object.assign({}, defaultProps, {
        activeType: CHART,
        type: REPORT_TABLE,
        visualization: { type: 'PIVOT_TABLE' },
    })

    const { queryByText } = render(<ViewAsMenuItems {...props} />)

    expect(queryByText('View as Map')).toBeTruthy()
    expect(queryByText('View as Chart')).toBeNull()
    expect(queryByText('View as Pivot table')).toBeTruthy()
})

test('renders menu for active type EVENT_REPORT and type EVENT_CHART', async () => {
    useDhis2ConnectionStatus.mockImplementation(jest.fn(() => online))
    const props = Object.assign({}, defaultProps, {
        activeType: EVENT_REPORT,
        type: EVENT_CHART,
        visualization: {},
    })

    const { queryByText } = render(<ViewAsMenuItems {...props} />)

    expect(queryByText('View as Map')).toBeNull()
    expect(queryByText('View as Chart')).toBeTruthy()
    expect(queryByText('View as Pivot table')).toBeNull()
})

test('renders menu for active type EVENT_CHART and type EVENT_REPORT', async () => {
    useDhis2ConnectionStatus.mockImplementation(jest.fn(() => online))
    const props = Object.assign({}, defaultProps, {
        activeType: EVENT_CHART,
        type: EVENT_REPORT,
        visualization: {},
    })

    const { queryByText } = render(<ViewAsMenuItems {...props} />)

    expect(queryByText('View as Map')).toBeNull()
    expect(queryByText('View as Chart')).toBeNull()
    expect(queryByText('View as Pivot table')).toBeTruthy()
})
