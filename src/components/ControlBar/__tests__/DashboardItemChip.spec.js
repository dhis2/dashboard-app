import React from 'react';
import { shallow } from 'enzyme';
import { Chip } from '@dhis2/ui-core';
import { DashboardItemChip } from '../DashboardItemChip';

describe('DashboardItemChip', () => {
    const defaultProps = {
        starred: false,
        selected: false,
        label: 'Hello Rainbow Dash',
        dashboardId: 'myLittlePony',
        classes: {
            icon: 'iconClass',
            selected: 'selectedClass',
            unselected: 'unselectedClass',
        },
    };

    const wrapper = props => shallow(<DashboardItemChip {...props} />);

    it('renders a Link', () => {
        const chipWrapper = wrapper(defaultProps);

        const div = chipWrapper.find('Link');
        expect(div).toHaveLength(1);
    });

    it('renders a Link containing everything else', () => {
        const chipWrapper = wrapper(defaultProps);
        const wrappingDiv = chipWrapper.find('Link').first();

        expect(wrappingDiv.children()).toEqual(chipWrapper.children());
    });

    it('renders a Chip inside the Link', () => {
        const chipWrapper = wrapper(defaultProps);

        expect(chipWrapper.find(Chip).length).toBe(1);
    });

    it('does not pass an icon to Chip when not starred', () => {
        const chip = wrapper(defaultProps).find(Chip);

        expect(chip.prop('icon')).toBeFalsy();
    });

    it('passes an icon to Chip when starred', () => {
        const props = Object.assign({}, defaultProps, { starred: true });

        const iconClasses = wrapper(props)
            .find(Chip)
            .prop('icon')
            .props.className.split(' ');

        expect(iconClasses.length).toEqual(2);
        expect(iconClasses).toContain('unselected');
    });

    it('sets the selected class on icon when chip is selected', () => {
        const props = Object.assign({}, defaultProps, {
            starred: true,
            selected: true,
        });
        const iconClasses = wrapper(props)
            .find(Chip)
            .prop('icon')
            .props.className.split(' ');

        expect(iconClasses.length).toEqual(2);
        expect(iconClasses).toContain('selected');
    });

    it('passes "label" property to Chip as children', () => {
        const chip = wrapper(defaultProps).find(Chip);

        expect(chip.childAt(0).text()).toBe(defaultProps.label);
    });
});
