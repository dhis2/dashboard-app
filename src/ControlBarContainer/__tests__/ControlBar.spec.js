import React from 'react';
import { shallow } from 'enzyme';
import EditBar from '../EditBar';
import DashboardsBar from '../DashboardsBar';
import {
    ControlBar,
    getInnerHeight,
    getOuterHeight,
} from '../ControlBarContainer';

describe('ControlBar', () => {
    let props;
    let shallowControlBar;
    const controlBar = () => {
        if (!shallowControlBar) {
            shallowControlBar = shallow(<ControlBar {...props} />);
        }
        return shallowControlBar;
    };

    beforeEach(() => {
        props = {
            edit: undefined,
        };
        shallowControlBar = undefined;
    });

    describe('when edit is true', () => {
        beforeEach(() => {
            props.edit = true;
        });
        it('renders an EditBar', () => {
            expect(controlBar().find(EditBar)).toHaveLength(1);
            expect(controlBar().find(DashboardsBar)).toHaveLength(0);
        });
    });

    describe('when edit is false', () => {
        beforeEach(() => {
            props.edit = false;
        });
        it('renders a DashboardsBar', () => {
            expect(controlBar().find(DashboardsBar)).toHaveLength(1);
            expect(controlBar().find(EditBar)).toHaveLength(0);
        });
    });

    describe('getInnerHeight', () => {
        it('calculates the inner height', () => {
            expect(getInnerHeight(2)).toEqual(72);
        });
    });

    describe('getOuterHeight', () => {
        it('is greater when bar not expandable', () => {
            expect(getOuterHeight(2, false)).toBeGreaterThan(
                getOuterHeight(2, true)
            );
        });
    });
});
