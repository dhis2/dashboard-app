import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { Alert } from '../AlertBar'

describe('AlertBar', () => {
    it('renders alert message', () => {
        const AlertBar = shallow(
            <Alert message="Luke I am your father" onClose={jest.fn()} />
        )
        expect(toJson(AlertBar)).toMatchSnapshot()
    })

    it('renders nothing when no message', () => {
        const AlertBar = shallow(<Alert />)
        expect(toJson(AlertBar)).toMatchSnapshot()
    })
})
