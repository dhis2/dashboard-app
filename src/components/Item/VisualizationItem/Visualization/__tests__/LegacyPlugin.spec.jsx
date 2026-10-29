import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import LegacyPlugin from '../LegacyPlugin.jsx'
import { load } from '../plugin.js'

let mockAuthorities = []

jest.mock('../../../../AppDataProvider/AppDataProvider.jsx', () => ({
    useCurrentUser: () => ({ authorities: mockAuthorities }),
}))

jest.mock('../plugin.js', () => ({
    ...jest.requireActual('../plugin.js'),
    load: jest.fn(),
    unmount: jest.fn(() => Promise.resolve()),
}))

const renderLegacyPlugin = () =>
    render(
        <LegacyPlugin
            item={{ id: 'rainbow', type: 'EVENT_REPORT' }}
            activeType="EVENT_REPORT"
            visualization={{ id: 'rainbowVis' }}
            style={{ height: '500px' }}
        />
    )

afterEach(() => {
    mockAuthorities = []
    jest.clearAllMocks()
})

test('renders the plugin container when the plugin loads', async () => {
    load.mockResolvedValue()

    const { container } = renderLegacyPlugin()

    await waitFor(() => expect(load).toHaveBeenCalled())
    expect(container.querySelector('#item-rainbow')).toBeInTheDocument()
})

test('renders the missing authority message when the plugin fails to load without the app authority', async () => {
    load.mockRejectedValue()

    renderLegacyPlugin()

    expect(
        await screen.findByText(
            "You don't have access to the Event Reports app needed to display this item"
        )
    ).toBeInTheDocument()
})

test('renders the error message when the plugin fails to load with the app authority', async () => {
    mockAuthorities = ['M_dhis-web-event-reports']
    load.mockRejectedValue()

    renderLegacyPlugin()

    expect(
        await screen.findByText('There was an error loading data for this item')
    ).toBeInTheDocument()
})
