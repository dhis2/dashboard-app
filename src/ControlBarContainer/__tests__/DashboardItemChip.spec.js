import React from 'react';

import 'jest-enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow } from 'enzyme';
import { getStubContext } from '../../../config/testsContext';
import DashboardItemChip from '../DashboardItemChip';
import MuiChip from 'material-ui/Chip';

Enzyme.configure({ adapter: new Adapter() });

describe('DashboardItemChip', () => {
    const renderWithProps = props =>
        shallow(<DashboardItemChip {...props} />, {
            context: getStubContext(),
        });

    it('should render DashboardItemChip with child MuiChip', () => {
        const props = {
            starred: true,
            selected: true,
            label: 'hey',
        };
        const wrapper = renderWithProps(props);

        const div = wrapper.find('div');
        expect(div).toHaveLength(1);
        expect(div.childAt(0).type()).toBe(MuiChip);
    });
});
