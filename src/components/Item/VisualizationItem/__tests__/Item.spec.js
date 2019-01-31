import React from 'react';
import { shallow } from 'enzyme';
import { CHART, REPORT_TABLE } from '../../../../modules/itemTypes';
import { Item } from '../Item';
import DefaultPlugin from '../DefaultPlugin';
import ChartPlugin from 'data-visualizer-plugin';

describe('VisualizationItem/Item', () => {
    let props;
    let shallowItem;

    const canvas = () => {
        if (!shallowItem) {
            shallowItem = shallow(<Item {...props} />);
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

        const chartPlugin = canvas().find(ChartPlugin);

        expect(chartPlugin.exists()).toBeTruthy();

        expect(chartPlugin.prop('config')).toEqual(props.visualization);
        expect(chartPlugin.prop('filters')).toEqual(props.itemFilter);
        expect(chartPlugin.prop('forDashboard')).toBeTruthy();
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

        const defaultPlugin = canvas().find(DefaultPlugin);

        expect(defaultPlugin.exists()).toBeTruthy();

        expect(defaultPlugin.prop('visualization')).toEqual(
            props.visualization
        );
        expect(defaultPlugin.prop('itemFilter')).toEqual(props.itemFilter);
    });
});
