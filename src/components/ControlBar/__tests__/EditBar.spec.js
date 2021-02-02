import React from 'react'
import { render } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { fireEvent } from '@testing-library/dom'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import { useDataEngine } from '@dhis2/app-runtime'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import EditBar from '../EditBar'
import { apiFetchDashboard } from '../../../api/dashboards'
import {
    acClearEditDashboard,
    tSaveDashboard,
} from '../../../actions/editDashboard'

const mockStore = configureMockStore()

jest.mock('@dhis2/app-runtime-adapter-d2')
jest.mock('@dhis2/app-runtime')
jest.mock('../../../api/dashboards')
jest.mock('../../../actions/editDashboard', () => ({
    acClearEditDashboard: jest.fn(),
    tSaveDashboard: jest.fn(),
}))

jest.mock(
    '@dhis2/d2-ui-translation-dialog',
    () =>
        function MockTranslationDialog() {
            return <div className="mock-translation-dialog" />
        }
)

/* eslint-disable react/prop-types */
jest.mock(
    '../ConfirmDeleteDialog',
    () =>
        function MockConfirmDeleteDialog({ open }) {
            return open ? <div className="mock-confirm-delete-dialog" /> : null
        }
)
/* eslint-enable react/prop-types */

useD2.mockReturnValue({
    d2: {
        currentUser: 'rainbowDash',
    },
})

apiFetchDashboard.mockResolvedValue({
    rainbow: {
        id: 'rainbow123',
    },
})

useDataEngine.mockReturnValue({
    dataEngine: {},
})

test.skip('renders the EditBar', () => {
    const store = {
        editDashboard: {
            id: 'rainbowDash',
            name: 'Rainbow Dash',
            access: {
                update: true,
                delete: false,
            },
            printPreviewView: false,
        },
    }
    const { container } = render(
        <Provider store={mockStore(store)}>
            <EditBar />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test.skip('renders only the Go to Dashboards button when no update access', () => {
    const store = {
        editDashboard: {
            id: 'rainbowDash',
            name: 'Rainbow Dash',
            access: {
                update: false,
                delete: false,
            },
            printPreviewView: false,
        },
    }
    const { container } = render(
        <Provider store={mockStore(store)}>
            <EditBar />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test.skip('renders Save and Discard buttons but no dialogs when no dashboard id', () => {
    const store = {
        editDashboard: {
            id: '',
            name: '',
            access: {},
            printPreviewView: false,
        },
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <EditBar />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test.skip('renders Translate, Delete, and Discard buttons when delete access', () => {
    const store = {
        editDashboard: {
            id: 'rainbowDash',
            name: 'Rainbow Dash',
            access: {
                update: true,
                delete: true,
            },
            printPreviewView: false,
        },
    }
    const { container } = render(
        <Provider store={mockStore(store)}>
            <EditBar />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test.skip('shows the confirm delete dialog when delete button clicked', () => {
    const store = {
        editDashboard: {
            id: 'rainbowDash',
            name: 'Rainbow Dash',
            access: {
                update: true,
                delete: true,
            },
            printPreviewView: false,
        },
    }
    const { getByText, asFragment } = render(
        <Provider store={mockStore(store)}>
            <EditBar />
        </Provider>
    )

    asFragment()

    act(() => {
        fireEvent.click(getByText('Delete'))
    })

    expect(asFragment()).toMatchSnapshot()
})

test.skip('shows the translate dialog', () => {
    const store = {
        editDashboard: {
            id: 'rainbowDash',
            name: 'Rainbow Dash',
            access: {
                update: true,
                delete: true,
            },
            printPreviewView: false,
        },
    }
    const { getByText, asFragment } = render(
        <Provider store={mockStore(store)}>
            <EditBar />
        </Provider>
    )

    act(() => {
        asFragment()
        asFragment()

        fireEvent.click(getByText('Translate'))
    })

    expect(asFragment()).toMatchSnapshot()
})

test.skip('triggers the discard action', () => {
    const store = mockStore({
        editDashboard: {
            id: 'rainbowDash',
            name: 'Rainbow Dash',
            access: {
                update: true,
                delete: true,
            },
            printPreviewView: false,
        },
    })

    store.dispatch = jest.fn()

    const { getByText } = render(
        <Provider store={store}>
            <Router history={createMemoryHistory()}>
                <EditBar />
            </Router>
        </Provider>
    )

    act(() => {
        fireEvent.click(getByText('Exit without saving'))
    })

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(acClearEditDashboard())
})

test.skip('triggers the save action', () => {
    const store = mockStore({
        editDashboard: {
            id: 'rainbowDash',
            name: 'Rainbow Dash',
            access: {
                update: true,
                delete: true,
            },
            printPreviewView: false,
        },
    })

    store.dispatch = jest.fn().mockResolvedValue('rainbowDash')

    const { getByText } = render(
        <Provider store={store}>
            <Router history={createMemoryHistory()}>
                <EditBar />
            </Router>
        </Provider>
    )

    act(() => {
        fireEvent.click(getByText('Save changes'))
    })

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(tSaveDashboard())
})
