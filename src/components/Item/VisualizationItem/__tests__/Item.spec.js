import React from 'react';
import { shallow } from 'enzyme';
import { CHART, REPORT_TABLE } from '../../../../modules/itemTypes';
import { Item } from '../Item';

jest.mock('data-visualizer-plugin', () => () => <div />);
jest.mock('../DefaultPlugin', () => () => <div />);
jest.mock('../ItemFooter', () => () => <div />);

describe('VisualizationItem/Item', () => {
    let props;
    let shallowItem;

    const canvas = () => {
        if (!shallowItem) {
            shallowItem = shallow(<Item {...props} />, { context: { d2: {} } });
        }
        return shallowItem;
    };

    beforeEach(() => {
        props = {
            classes: {},
            item: {
                type: REPORT_TABLE,
                id: 'testItem2',
                reportTable: {
                    id: 'pivot1',
                    name: 'Test pivot',
                },
            },
            editMode: false,
            itemFilter: {
                brilliance: 100,
            },
            visualization: {},
            onToggleItemExpanded: jest.fn(),
        };
        shallowItem = undefined;
    });

    it('renders a ChartPlugin when a chart item is passed', () => {
        props.visualization = {
            name: 'Test chart',
            description: 'Test chart mock',
        };
        props.item = {
            type: CHART,
            id: 'testItem1',
            chart: {
                id: 'chart1',
                name: 'Test chart',
            },
        };

        expect(canvas()).toMatchSnapshot();
    });

    it('renders a DefaultPlugin when a item different from chart is passed', () => {
        props.visualization = {
            name: 'Test pivot',
            description: 'Test pivot mock',
        };

        props.item = {
            type: REPORT_TABLE,
            id: 'testItem2',
            reportTable: {
                id: 'pivot1',
                name: 'Test pivot',
            },
        };

        expect(canvas()).toMatchSnapshot();
    });
});
