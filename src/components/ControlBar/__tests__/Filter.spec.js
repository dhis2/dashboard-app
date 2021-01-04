import React from 'react'
import { mount } from 'enzyme'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import Filter, {
    FilterUnconnected,
    KEYCODE_ENTER,
    KEYCODE_ESCAPE,
} from '../Filter'
import WindowDimensionsProvider from '../../WindowDimensionsProvider'

const mockStore = configureMockStore()

describe('Filter', () => {
    it('matches the snapshot when filterText property is empty', () => {
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

    describe('when filterText property is provided', () => {
        it('renders an input with correct value property', () => {
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
    })

    describe('when input value is changed', () => {
        it('triggers setDashboardsFilter property with correct value', () => {
            const props = {
                filterText: '',
                setDashboardsFilter: jest.fn(),
                clearDashboardsFilter: jest.fn(),
                onKeypressEnter: jest.fn(),
                classes: {},
            }
            const newValue = 'fluttershy'
            const e = {
                target: { value: newValue },
                preventDefault: jest.fn(),
            }
            const filter = mount(
                <WindowDimensionsProvider>
                    <FilterUnconnected {...props} />
                </WindowDimensionsProvider>
            )
            filter.find('input').simulate('change', e)
            expect(e.preventDefault).toHaveBeenCalledTimes(1)
            expect(props.setDashboardsFilter).toHaveBeenCalledTimes(1)
            expect(props.setDashboardsFilter).toHaveBeenCalledWith(newValue)
        })
    })

    describe('when key is pressed', () => {
        it('triggers onKeypressEnter when key is ENTER', () => {
            const props = {
                filterText: '',
                clearDashboardsFilter: jest.fn(),
                onKeypressEnter: jest.fn(),
                classes: {},
            }
            const filter = mount(
                <WindowDimensionsProvider>
                    <FilterUnconnected {...props} />
                </WindowDimensionsProvider>
            )
            filter.find('input').simulate('keyUp', { keyCode: KEYCODE_ENTER })

            expect(props.onKeypressEnter).toHaveBeenCalledTimes(1)
            expect(props.clearDashboardsFilter).toHaveBeenCalledTimes(1)
        })

        it('triggers setDashboardsFilter when key is ESCAPE', () => {
            const props = {
                filterText: '',
                clearDashboardsFilter: jest.fn(),
                onKeypressEnter: jest.fn(),
                classes: {},
            }
            const filter = mount(
                <WindowDimensionsProvider>
                    <FilterUnconnected {...props} />
                </WindowDimensionsProvider>
            )

            filter.find('input').simulate('keyUp', { keyCode: KEYCODE_ESCAPE })

            expect(props.clearDashboardsFilter).toHaveBeenCalledTimes(1)
            expect(props.onKeypressEnter).not.toHaveBeenCalled()
        })
    })
})
