import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import Filter from '../Filter'
import WindowDimensionsProvider from '../../../../components/WindowDimensionsProvider'

const mockStore = configureMockStore()

test('Filter renders with empty filter text', () => {
    const store = {
        dashboardsFilter: '',
    }
    const props = { classes: {} }
    const { container } = render(
        <Provider store={mockStore(store)}>
            <WindowDimensionsProvider>
                <Filter {...props} />
            </WindowDimensionsProvider>
        </Provider>
    )
    expect(container).toMatchSnapshot()
})

test('Filter renders with filter text', () => {
    const store = {
        dashboardsFilter: 'rainbow',
    }

    const props = { classes: {} }
    const { container } = render(
        <Provider store={mockStore(store)}>
            <WindowDimensionsProvider>
                <Filter {...props} />
            </WindowDimensionsProvider>
        </Provider>
    )

    expect(container).toMatchSnapshot()
})
