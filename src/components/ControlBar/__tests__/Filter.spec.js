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
            onChangeFilterText: jest.fn(),
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
            expect(props.onChangeFilterText).not.toHaveBeenCalled()
        })
    })

    describe('when input value is changed', () => {
        it('triggers onChangeFilterText property with correct value', () => {
            const newValue = 'fluttershy'
            const e = {
                target: { value: newValue },
                preventDefault: jest.fn(),
            }
            const inputField = filter().find('input')
            inputField.simulate('change', e)
            expect(e.preventDefault).toHaveBeenCalledTimes(1)
            expect(props.onChangeFilterText).toHaveBeenCalledTimes(1)
            expect(props.onChangeFilterText).toHaveBeenCalledWith(newValue)
        })
    })

    describe('when key is pressed', () => {
        it('triggers onKeypressEnter when key is ENTER', () => {
            filter()
                .find('input')
                .simulate('keyUp', { keyCode: KEYCODE_ENTER })

            expect(props.onKeypressEnter).toHaveBeenCalledTimes(1)
            expect(props.onChangeFilterText).toHaveBeenCalled()
        })

        it('triggers onChangeFilterText when key is ESCAPE', () => {
            props.onChangeFilterText = jest.fn()
            props.onKeypressEnter = jest.fn()

            filter()
                .find('input')
                .simulate('keyUp', { keyCode: KEYCODE_ESCAPE })

            expect(props.onChangeFilterText).toHaveBeenCalledTimes(1)
            expect(props.onChangeFilterText).toHaveBeenCalledWith()
            expect(props.onKeypressEnter).not.toHaveBeenCalled()
        })
    })
})
