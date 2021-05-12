import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import NewDashboard from '../NewDashboard'
import WindowDimensionsProvider from '../../../components/WindowDimensionsProvider'

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

const store = {
    editDashboard: {
        id: '',
        access: { update: true, delete: true },
        printPreviewView: false,
    },
}

test('NewDashboard renders dashboard', () => {
    const { container } = render(
        <>
            <header style={{ height: '48px' }} />
            <Provider store={mockStore(store)}>
                <WindowDimensionsProvider>
                    <NewDashboard />
                </WindowDimensionsProvider>
            </Provider>
        </>
    )

    expect(container).toMatchSnapshot()
})

test('NewDashboard renders print preview', () => {
    store.editDashboard.printPreviewView = true

    const { container } = render(
        <>
            <header style={{ height: '48px' }} />
            <Provider store={mockStore(store)}>
                <WindowDimensionsProvider>
                    <NewDashboard />
                </WindowDimensionsProvider>
            </Provider>
        </>
    )
    expect(container).toMatchSnapshot()
})
