import React from 'react';
import { shallow } from 'enzyme';
import ItemHeaderButton from '../ItemHeaderButton';

it('renders correctly', () => {
    const button = shallow(<ItemHeaderButton
        onClick={Function.prototype}
        style={{ fill: 'purple' }}
    >
        My Little Pony
    </ItemHeaderButton>);
    expect(button).toMatchSnapshot();
});
