import React from 'react';
import { shallow } from 'enzyme';
import { PageContainer } from '../PageContainer';
import TitleBar from '../../TitleBar/TitleBar';
import ItemGrid from '../../ItemGrid/ItemGrid';
import { NoContentMessage } from '../../widgets/NoContentMessage';

describe('PageContainer', () => {
    let props;
    let shallowPageContainer;
    const pageContainer = () => {
        if (!shallowPageContainer) {
            shallowPageContainer = shallow(<PageContainer {...props} />);
        }
        return shallowPageContainer;
    };

    const assertTitleAndGrid = () => {
        const children = pageContainer().children();

        expect(children.length).toBe(1);
        expect(children.dive().find(NoContentMessage)).toHaveLength(0);
        expect(children.dive().find(TitleBar)).toHaveLength(1);
        expect(children.dive().find(ItemGrid)).toHaveLength(1);
    };

    const assertNoContentMessage = () => {
        const children = pageContainer().children();

        expect(children.length).toBe(1);
        expect(children.dive().find(NoContentMessage)).toHaveLength(1);
        expect(children.dive().find(ItemGrid)).toHaveLength(0);
    };

    beforeEach(() => {
        props = {
            edit: undefined,
            selectedId: undefined,
            dashboardsIsEmpty: undefined,
            dashboardsLoaded: undefined,
        };
        shallowPageContainer = undefined;
    });

    it('renders a div', () => {
        expect(pageContainer().find('div').length).toBeGreaterThan(0);
    });

    describe('when "dashboardsLoaded" is false', () => {
        it('does not render any children inside the div', () => {
            props.dashboardsLoaded = false;
            expect(pageContainer().children().length).toBe(0);
        });
    });

    describe('when "dashboardsLoaded" is true', () => {
        beforeEach(() => {
            props.dashboardsLoaded = true;
        });

        describe('when "selectedId" is null', () => {
            it('does not render any children inside the div', () => {
                props.selectedId = null;
                expect(pageContainer().children().length).toBe(0);
            });
        });

        describe('when "dashboardsIsEmpty" is true', () => {
            beforeEach(() => {
                props.dashboardsIsEmpty = true;
            });

            it('renders a NoContentMessage when not in edit mode', () => {
                props.edit = false;
                assertNoContentMessage();
            });

            it('renders a Titlebar and ItemGrid when in edit mode', () => {
                props.edit = true;
                assertTitleAndGrid();
            });
        });

        describe('when "dashboardsIsEmpty" is false', () => {
            beforeEach(() => {
                props.dashboardsIsEmpty = false;
            });

            describe('when selectedId is not null or false', () => {
                beforeEach(() => {
                    props.selectedId = '123xyz';
                });

                it('renders a TitleBar and ItemGrid when in edit mode', () => {
                    props.edit = true;
                    assertTitleAndGrid();
                });

                it('renders a TitleBar and ItemGrid when not in edit mode', () => {
                    props.edit = false;
                    assertTitleAndGrid();
                });
            });

            describe('when selectedId is false', () => {
                beforeEach(() => {
                    props.selectedId = false;
                });

                it('renders a TitleBar and ItemGrid when in edit mode', () => {
                    props.edit = true;
                    assertTitleAndGrid();
                });

                it('renders a NoContentMessage when not in edit mode', () => {
                    props.edit = false;
                    assertNoContentMessage();
                });
            });
        });
    });
});
