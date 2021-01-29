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
import { acClearEditDashboard } from '../../../actions/editDashboard'

const mockStore = configureMockStore()

jest.mock('@dhis2/app-runtime-adapter-d2')
jest.mock('@dhis2/app-runtime')
jest.mock('../../../api/dashboards')

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

useDataEngine.mockReturnValue({
    dataEngine: {},
})

test('renders the EditBar', async () => {
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

    const promise = Promise.resolve()
    apiFetchDashboard.mockResolvedValue(promise)

    const { container } = render(
        <Provider store={mockStore(store)}>
            <EditBar />
        </Provider>
    )
    await act(() => promise)
    expect(container).toMatchSnapshot()
})

test('renders only the Go to Dashboards button when no update access', async () => {
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

    const promise = Promise.resolve()
    apiFetchDashboard.mockResolvedValue(promise)

    const { container } = render(
        <Provider store={mockStore(store)}>
            <EditBar />
        </Provider>
    )
    await act(() => promise)
    expect(container).toMatchSnapshot()
})

test('renders Save and Discard buttons but no dialogs when no dashboard id', async () => {
    const store = {
        editDashboard: {
            id: '',
            name: '',
            access: {},
            printPreviewView: false,
        },
    }

    const promise = Promise.resolve()
    apiFetchDashboard.mockResolvedValue(promise)

    const { container } = render(
        <Provider store={mockStore(store)}>
            <EditBar />
        </Provider>
    )

    await act(() => promise)
    expect(container).toMatchSnapshot()
})

test('renders Translate, Delete, and Discard buttons when delete access', async () => {
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
    const promise = Promise.resolve()
    apiFetchDashboard.mockResolvedValue(promise)

    const { container } = render(
        <Provider store={mockStore(store)}>
            <EditBar />
        </Provider>
    )

    await act(() => promise)
    expect(container).toMatchSnapshot()
})

test('shows the confirm delete dialog when delete button clicked', async () => {
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
    const promise = Promise.resolve()
    apiFetchDashboard.mockResolvedValue(promise)
    const { getByText, asFragment } = render(
        <Provider store={mockStore(store)}>
            <EditBar />
        </Provider>
    )

    await act(() => promise)

    asFragment()

    act(() => {
        fireEvent.click(getByText('Delete'))
    })

    expect(asFragment()).toMatchSnapshot()
})

test('shows the translate dialog', async () => {
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

    const promise = Promise.resolve()
    apiFetchDashboard.mockResolvedValue(promise)
    const { getByText, asFragment } = render(
        <Provider store={mockStore(store)}>
            <EditBar />
        </Provider>
    )

    await act(() => promise)

    act(() => {
        asFragment()
        asFragment()

        fireEvent.click(getByText('Translate'))
    })

    expect(asFragment()).toMatchSnapshot()
})

test('triggers the discard action', async () => {
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

    const promise = Promise.resolve()
    apiFetchDashboard.mockResolvedValue(promise)

    const { getByText } = render(
        <Provider store={store}>
            <Router history={createMemoryHistory()}>
                <EditBar />
            </Router>
        </Provider>
    )

    await act(() => promise)

    act(() => {
        fireEvent.click(getByText('Exit without saving'))
    })

    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(acClearEditDashboard())
})
