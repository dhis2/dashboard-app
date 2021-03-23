import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import NewDashboard from '../NewDashboard'

jest.mock(
    '../EditBar',
    () =>
        function MockEditBar() {
            return <div>EditBar</div>
        }
)

jest.mock(
    '../EditTitleBar',
    () =>
        function MockTitleBar() {
            return <div>EditTitleBar</div>
        }
)
jest.mock(
    '../EditItemGrid',
    () =>
        function MockEditItemGrid() {
            return <div>EditItemGrid</div>
        }
)

jest.mock(
    '../../Print/PrintLayoutDashboard',
    () =>
        function MockLayoutPrintPreview() {
            return <div>LayoutPrintPreview</div>
        }
)

const mockStore = configureMockStore()

const store = {
    dashboards: {
        byId: {
            rainbowdash: {
                id: 'rainbowdash',
                access: {
                    update: true,
                    delete: true,
                },
            },
        },
        items: [],
    },
    selected: {
        id: 'rainbowdash',
    },
    editDashboard: {
        id: '',
        access: {},
        printPreviewView: false,
    },
}

test('NewDashboard renders dashboard', () => {
    const { container } = render(
        <Provider store={mockStore(store)}>
            <NewDashboard />
        </Provider>
    )

    expect(container).toMatchSnapshot()
})

test('NewDashboard renders print preview', () => {
    store.editDashboard.printPreviewView = true

    const { container } = render(
        <Provider store={mockStore(store)}>
            <NewDashboard />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})
