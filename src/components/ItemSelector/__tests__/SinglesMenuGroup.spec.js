import React from 'react';
import { shallow } from 'enzyme';
import { SinglesMenuGroup } from '../SinglesMenuGroup';

describe('SinglesMenuGroup', () => {
    const wrapper = props => shallow(<SinglesMenuGroup {...props} />);

    it('matches snapshot', () => {
        const props = {
            acAddDashboardItem: jest.fn(),
            category: {
                header: () => 'ponies',
                items: [
                    {
                        type: 'colorful',
                        name: Function.prototype,
                    },
                    {
                        type: 'greytone',
                        name: Function.prototype,
                    },
                ],
            },
        };
        expect(wrapper(props)).toMatchSnapshot();
    });
});
