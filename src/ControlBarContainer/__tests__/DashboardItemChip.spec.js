import React from 'react';
import { shallow } from 'enzyme';
import MuiChip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import { getStubContext } from '../../../config/testsContext';
import DashboardItemChip from '../DashboardItemChip';

describe('DashboardItemChip', () => {
    const defaultProps = {
        starred: false,
        selected: false,
        label: 'Hello Rainbow Dash',
        onClick: jest.fn(),
    };

    const chip = props =>
        shallow(<DashboardItemChip {...props} />, {
            context: getStubContext(),
        });

    it('renders a div', () => {
        const chipWrapper = chip(defaultProps);

        const div = chipWrapper.find('div');
        expect(div).toHaveLength(1);
    });

    it('renders a div containing everything else', () => {
        const chipWrapper = chip(defaultProps);
        const wrappingDiv = chipWrapper.find('div').first();

        expect(wrappingDiv.children()).toEqual(chipWrapper.children());
    });

    it('renders a MuiChip inside the div', () => {
        const chipWrapper = chip(defaultProps);

        expect(chipWrapper.find(MuiChip).length).toBe(1);
    });

    it('has an avatar when starred', () => {
        const props = Object.assign({}, defaultProps, { starred: true });
        const muiChip = chip(props).find(MuiChip);

        expect(muiChip.children().length).toBe(2);
        expect(muiChip.childAt(0).type()).toBe(Avatar);
    });

    it('does not have an avatar when not starred', () => {
        const muiChip = chip(defaultProps).find(MuiChip);

        expect(muiChip.children().length).toBe(1);
    });

    it('passes "label" property to MuiChip as children', () => {
        const muiChip = chip(defaultProps).find(MuiChip);

        expect(muiChip.childAt(0).text()).toBe(defaultProps.label);
    });

    it('passes the onClick function to MuiChip', () => {
        const onClick = jest.fn();
        const props = Object.assign({}, defaultProps, { onClick });

        const muiChip = chip(props).find(MuiChip);

        expect(muiChip.props().onClick).toBe(onClick);
    });
});
