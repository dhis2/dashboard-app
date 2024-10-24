import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import WindowDimensionsProvider from '../../../components/WindowDimensionsProvider.jsx'
import NewDashboard from '../NewDashboard.jsx'

/* eslint-disable react/prop-types */
jest.mock('@dhis2/ui', () => {
    const originalModule = jest.requireActual('@dhis2/ui')

    return {
        __esModule: true,
        ...originalModule,
        NoticeBox: function Mock({ warning, ...props }) {
            return (
                <div
                    className="ui-NoticeBox"
                    data-warning={warning}
                    {...props}
                />
            )
        },
        CenteredContent: function Mock({ children }) {
            return <div className="ui-CenteredContent">{children}</div>
        },
    }
})
/* eslint-enable react/prop-types */

jest.mock(
    '../ActionsBar.jsx',
    () =>
        function MockActionsBar() {
            return <div>ActionsBar</div>
        }
)

jest.mock(
    '../TitleBar.jsx',
    () =>
        function MockTitleBar() {
            return <div>TitleBar</div>
        }
)
jest.mock(
    '../ItemGrid.jsx',
    () =>
        function MockEditItemGrid() {
            return <div>ItemGrid</div>
        }
)

jest.mock(
    '../../print/PrintLayoutDashboard.jsx',
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
