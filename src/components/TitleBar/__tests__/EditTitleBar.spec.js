import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { EditTitleBar } from '../EditTitleBar'

jest.mock('../../ItemSelector/ItemSelector', () => 'ItemSelector')

describe('EditTitleBar', () => {
    const props = {
        name: 'Rainbow Dash',
        description: 'The blue one',
        onChangeTitle: Function.prototype,
        onChangeDescription: Function.prototype,
        classes: {
            section: 'section',
            titleDescription: 'titledesc',
            title: 'title',
            description: 'description',
            underline: 'underline',
            input: 'input',
            itemSelector: 'itemSelector',
        },
    }

    it('renders correctly', () => {
        const tree = shallow(<EditTitleBar {...props} />)
        expect(toJson(tree)).toMatchSnapshot()
    })

    it('renders correctly when no name', () => {
        props.name = ''
        const tree = shallow(<EditTitleBar {...props} />)
        expect(toJson(tree)).toMatchSnapshot()
    })
})
