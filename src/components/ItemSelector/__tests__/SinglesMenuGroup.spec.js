import React from 'react';
import { shallow } from 'enzyme';
import { SinglesMenuGroup } from '../SinglesMenuGroup';

describe('SinglesMenuGroup', () => {
    const wrapper = props => shallow(<SinglesMenuGroup {...props} />);

    it('matches snapshot', () => {
        const props = {
            acAddDashboardItem: jest.fn(),
            category: {
                header: 'ponies',
                items: [
                    {
                        type: 'colorful',
                        name: 'Rainbow Dash',
                    },
                    {
                        type: 'greytone',
                        name: 'B&W',
                    },
                ],
            },
        };
        expect(wrapper(props)).toMatchSnapshot();
    });
});
