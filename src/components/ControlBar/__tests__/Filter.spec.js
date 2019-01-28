import React from 'react';
import { shallow } from 'enzyme';
import Filter, { Filter as FilterField, ClearButton } from '../Filter';

describe('Filter', () => {
    let props;
    let shallowFilter;
    const name = 'rainbow';
    const filter = () => {
        if (!shallowFilter) {
            shallowFilter = shallow(<Filter {...props} />);
        }
        return shallowFilter;
    };

    beforeEach(() => {
        props = {
            name,
            onChangeName: jest.fn(),
        };
        shallowFilter = undefined;
    });

    it('renders an FilterField with correct prop', () => {
        const filterField = filter().find(FilterField);
        expect(filterField.length).toBe(1);
        expect(filterField.props().name).toEqual(props.name);
    });

    it('renders a ClearButton with correct prop', () => {
        const btn = filter().find(ClearButton);
        expect(btn.length).toBe(1);
        expect(btn.props().name).toEqual(props.name);
    });
});
