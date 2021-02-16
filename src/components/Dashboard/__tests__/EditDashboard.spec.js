import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import EditDashboard from '../EditDashboard'

jest.mock(
    '../../ControlBar/EditBar',
    () =>
        function MockEditBar() {
            return <div>EditBar</div>
        }
)

jest.mock(
    '../../TitleBar/EditTitleBar',
    () =>
        function MockTitleBar() {
            return <div>EditTitleBar</div>
        }
)
jest.mock(
    '../../ItemGrid/EditItemGrid',
    () =>
        function MockEditItemGrid() {
            return <div>EditItemGrid</div>
        }
)

jest.mock(
    '../PrintLayoutDashboard',
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
        id: 'rainbowdash',
        access: {
            update: true,
            delete: true,
        },
    },
}

const props = {
    setEditDashboard: jest.fn(),
}

test('EditDashboard renders dashboard', () => {
    const { container } = render(
        <Provider store={mockStore(store)}>
            <EditDashboard {...props} />
        </Provider>
    )

    expect(container).toMatchSnapshot()
})

test('EditDashboard renders print preview', () => {
    store.editDashboard.printPreviewView = true

    const { container } = render(
        <Provider store={mockStore(store)}>
            <EditDashboard {...props} />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('EditDashboard renders message when not enough access', () => {
    store.dashboards.byId.rainbowdash.access.update = false
    store.dashboards.byId.rainbowdash.access.delete = false
    store.editDashboard.access.update = false
    store.editDashboard.access.delete = false

    const { container } = render(
        <Provider store={mockStore(store)}>
            <EditDashboard {...props} />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})
