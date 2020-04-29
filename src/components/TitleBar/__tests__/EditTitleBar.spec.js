import React from 'react'
import { shallow } from 'enzyme'
import { EditTitleBar } from '../EditTitleBar'

jest.mock('@dhis2/d2-ui-core/text-field/TextField', () => 'textfield')
jest.mock('../../ItemSelector/ItemSelector', () => 'itemselector')

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

    it('renders correctly when displayName not provided', () => {
        const tree = shallow(<EditTitleBar {...props} />)
        expect(tree).toMatchSnapshot()
    })

    it('renders correctly when displayName is provided', () => {
        const tree = shallow(
            <EditTitleBar displayName="Regnbue Dash" {...props} />
        )
        expect(tree).toMatchSnapshot()
    })
})
