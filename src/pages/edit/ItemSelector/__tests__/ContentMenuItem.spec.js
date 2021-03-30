import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import ContentMenuItem from '../ContentMenuItem'

describe('ContentMenuItem', () => {
    let props
    const wrapper = () => shallow(<ContentMenuItem {...props} />)

    beforeEach(() => {
        props = {
            type: 'pony',
            name: 'Pinkie Pie',
            onInsert: jest.fn(),
        }
    })

    it('has onClick action on the Menu Item', () => {
        const menuItem = wrapper()

        expect(menuItem.prop('onClick')).toEqual(props.onInsert)
    })

    it('has a LaunchLink when url is provided', () => {
        props.url = 'http://ponies-r-us.com'

        expect(toJson(wrapper())).toMatchSnapshot()
    })

    it('does not have LaunchLink if no url provided', () => {
        expect(toJson(wrapper())).toMatchSnapshot()
    })
})
