import { render } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router-dom'
import configureMockStore from 'redux-mock-store'
import { apiFetchDashboard } from '../../../api/fetchDashboard'
import WindowDimensionsProvider from '../../../components/WindowDimensionsProvider'
import EditDashboard from '../EditDashboard'

jest.mock('../../../api/fetchDashboard')

jest.mock(
    '../ActionsBar',
    () =>
        function MockActionsBar() {
            return <div>ActionsBar</div>
        }
)

jest.mock(
    '../TitleBar',
    () =>
        function MockTitleBar() {
            return <div>TitleBar</div>
        }
)
jest.mock(
    '../ItemGrid',
    () =>
        function MockEditItemGrid() {
            return <div>ItemGrid</div>
        }
)

jest.mock(
    '../../print/PrintLayoutDashboard',
    () =>
        function MockLayoutPrintPreview() {
            return <div>LayoutPrintPreview</div>
        }
)

const mockStore = configureMockStore()

const renderWithRouterMatch = (
    ui,
    {
        route = '/',
        history = createMemoryHistory({ initialEntries: [route] }),
        store = {},
    } = {}
) => {
    return {
        ...render(
            <>
                <header />
                <Provider store={mockStore(store)}>
                    <WindowDimensionsProvider>
                        <Router history={history}>
                            <Route path={'edit/:id'} component={ui} />
                        </Router>
                    </WindowDimensionsProvider>
                </Provider>
            </>
        ),
    }
}

const dashboardId = 'rainbowdash'

test('EditDashboard renders dashboard', async () => {
    const promise = Promise.resolve()
    apiFetchDashboard.mockResolvedValue({
        id: dashboardId,
        access: { update: true },
    })
    const { container } = renderWithRouterMatch(EditDashboard, {
        route: `edit/${dashboardId}`,

        store: {
            editDashboard: {
                printPreviewView: false,
            },
        },
    })

    await act(() => promise)
    expect(container).toMatchSnapshot()
})

test('EditDashboard renders print preview', async () => {
    const promise = Promise.resolve()
    apiFetchDashboard.mockResolvedValue({
        id: dashboardId,
        access: { update: true },
    })
    const { container } = renderWithRouterMatch(EditDashboard, {
        route: `edit/${dashboardId}`,
        store: {
            editDashboard: {
                printPreviewView: true,
            },
        },
    })

    await act(() => promise)
    expect(container).toMatchSnapshot()
})

test('EditDashboard renders message when not enough access', async () => {
    const promise = Promise.resolve()
    apiFetchDashboard.mockResolvedValue({
        id: dashboardId,
        access: { update: false },
    })
    const { container } = renderWithRouterMatch(EditDashboard, {
        route: `edit/${dashboardId}`,
        store: {
            editDashboard: {
                printPreviewView: false,
            },
        },
    })

    await act(() => promise)
    expect(container).toMatchSnapshot()
})

test('EditDashboard does not render titlebar and grid if small screen', async () => {
    global.innerWidth = 480
    const promise = Promise.resolve()
    apiFetchDashboard.mockResolvedValue({
        id: dashboardId,
        access: { update: true },
    })
    const { container } = renderWithRouterMatch(EditDashboard, {
        route: `edit/${dashboardId}`,
        store: {
            editDashboard: {
                printPreviewView: false,
            },
        },
    })

    await act(() => promise)
    expect(container).toMatchSnapshot()
})
