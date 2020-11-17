import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { Filter, KEYCODE_ENTER, KEYCODE_ESCAPE } from '../Filter'

describe('Filter', () => {
    let props
    let shallowFilter
    const filter = () => {
        if (!shallowFilter) {
            shallowFilter = shallow(<Filter {...props} />)
        }
        return shallowFilter
    }

    beforeEach(() => {
        props = {
            filterText: '',
            setDashboardsFilter: jest.fn(),
            clearDashboardsFilter: jest.fn(),
            onKeypressEnter: jest.fn(),
            classes: {},
        }
        shallowFilter = undefined
    })

    it('matches the snapshot when filterText property is empty', () => {
        expect(toJson(filter())).toMatchSnapshot()
    })

    describe('when updated filterText property is provided', () => {
        it('renders an input with correct value property', () => {
            const filterWrapper = filter()
            filterWrapper.setProps({ filterText: 'rainbow' })

            expect(filterWrapper.find('input').props().value).toEqual('rainbow')
            expect(props.setDashboardsFilter).not.toHaveBeenCalled()
        })
    })

    describe('when input value is changed', () => {
        it('triggers setDashboardsFilter property with correct value', () => {
            const newValue = 'fluttershy'
            const e = {
                target: { value: newValue },
                preventDefault: jest.fn(),
            }
            const inputField = filter().find('input')
            inputField.simulate('change', e)
            expect(e.preventDefault).toHaveBeenCalledTimes(1)
            expect(props.setDashboardsFilter).toHaveBeenCalledTimes(1)
            expect(props.setDashboardsFilter).toHaveBeenCalledWith(newValue)
        })
    })

    describe('when key is pressed', () => {
        it('triggers onKeypressEnter when key is ENTER', () => {
            filter().find('input').simulate('keyUp', { keyCode: KEYCODE_ENTER })

            expect(props.onKeypressEnter).toHaveBeenCalledTimes(1)
            expect(props.clearDashboardsFilter).toHaveBeenCalledTimes(1)
        })

        it('triggers setDashboardsFilter when key is ESCAPE', () => {
            props.setDashboardsFilter = jest.fn()
            props.onKeypressEnter = jest.fn()

            filter()
                .find('input')
                .simulate('keyUp', { keyCode: KEYCODE_ESCAPE })

            expect(props.clearDashboardsFilter).toHaveBeenCalledTimes(1)
            expect(props.onKeypressEnter).not.toHaveBeenCalled()
        })
    })
})
