import { fireEvent } from '@testing-library/dom'
import { render, waitFor } from '@testing-library/react'
import React from 'react'
import { useSystemSettings } from '../../../AppDataProvider/AppDataProvider.jsx'
import WindowDimensionsProvider from '../../../WindowDimensionsProvider.jsx'
import { ItemContextMenu } from '../ItemContextMenu.jsx'

jest.mock('../../../AppDataProvider/AppDataProvider', () => {
    return {
        __esModule: true,
        default: jest.fn((children) => <div>{children}</div>),
        useSystemSettings: jest.fn(),
    }
})

jest.mock('@dhis2/app-runtime', () => ({
    useDhis2ConnectionStatus: jest.fn(() => ({
        isConnected: true,
        isDisconnected: false,
    })),
    useConfig: jest.fn(() => ({ baseUrl: 'dhis2' })),
}))

const mockSystemSettingsDefault = {
    allowVisOpenInApp: true,
    allowVisFullscreen: true,
}

const defaultProps = {
    appName: 'My Plugin',
    appUrl: 'https://iframe/app/launch',
    enterFullscreen: Function.prototype,
    loadItemFailed: false,
}

test('renders "Open in [app]" when the app has an entrypoint (appUrl)', async () => {
    useSystemSettings.mockReturnValue(mockSystemSettingsDefault)

    const { getByRole, queryByText } = render(
        <WindowDimensionsProvider>
            <ItemContextMenu {...defaultProps} />
        </WindowDimensionsProvider>
    )

    fireEvent.click(getByRole('button'))

    await waitFor(() => {
        expect(queryByText('Open in My Plugin')).toBeTruthy()
        expect(queryByText('View fullscreen')).toBeTruthy()
    })
})

test('does not render "Open in [app]" when the plugin has no entrypoint (no appUrl)', async () => {
    useSystemSettings.mockReturnValue(mockSystemSettingsDefault)

    const { getByRole, queryByText } = render(
        <WindowDimensionsProvider>
            <ItemContextMenu {...defaultProps} appUrl={undefined} />
        </WindowDimensionsProvider>
    )

    fireEvent.click(getByRole('button'))

    await waitFor(() => {
        expect(queryByText(/Open in/i)).toBeNull()
        // the menu is still useful for fullscreen
        expect(queryByText('View fullscreen')).toBeTruthy()
    })
})

test('renders null when the plugin has no entrypoint and fullscreen is disabled', () => {
    useSystemSettings.mockReturnValue({
        allowVisOpenInApp: true,
        allowVisFullscreen: false,
    })

    const { container } = render(
        <WindowDimensionsProvider>
            <ItemContextMenu {...defaultProps} appUrl={undefined} />
        </WindowDimensionsProvider>
    )

    expect(container.firstChild).toBeNull()
})
