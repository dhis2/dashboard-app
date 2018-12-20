import React from 'react';
import { shallow } from 'enzyme';

import { EditDashboard, Content } from '../EditDashboard';
import { NoContentMessage } from '../../../widgets/NoContentMessage';

jest.mock('../DashboardContent', () => () => (
    <div id="mockDashboardContent">mockDashboardContent</div>
));

describe('EditDashboard', () => {
    let props;
    let shallowEditDashboard;
    const editDashboard = () => {
        if (!shallowEditDashboard) {
            shallowEditDashboard = shallow(<EditDashboard {...props} />);
        }
        return shallowEditDashboard;
    };

    const assertContent = hasContent => {
        const content = editDashboard().find(Content);

        expect(content.length).toBe(1);
        expect(content.dive().find(NoContentMessage)).toHaveLength(
            hasContent ? 0 : 1
        );
    };

    beforeEach(() => {
        props = {
            dashboard: undefined,
            id: undefined,
            updateAccess: undefined,
            items: undefined,
            dashboardsLoaded: undefined,
        };
        shallowEditDashboard = undefined;
    });

    describe('when "dashboardsLoaded" is false', () => {
        it('does not render any children inside the div', () => {
            props.dashboardsLoaded = false;

            expect(
                editDashboard()
                    .find('.dashboard-wrapper')
                    .children().length
            ).toBe(0);
        });
    });

    describe('when "dashboardsLoaded" is true', () => {
        beforeEach(() => {
            props.dashboardsLoaded = true;
        });

        describe('when "id" is null', () => {
            it('does not render any children inside the div', () => {
                props.id = null;
                expect(
                    editDashboard()
                        .find('.dashboard-wrapper')
                        .children().length
                ).toBe(0);
            });
        });

        describe('when id is not null', () => {
            beforeEach(() => {
                props.id = 'abc123';
            });

            describe('when updateAccess is true', () => {
                it('renders DashboardContent', () => {
                    props.updateAccess = true;
                    assertContent(true);
                });
            });

            describe('when updateAccess is false', () => {
                it('renders a NoContentMessage', () => {
                    props.updateAccess = false;
                    assertContent(false);
                });
            });
        });
    });
});
