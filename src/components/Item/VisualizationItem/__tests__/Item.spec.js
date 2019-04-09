import React from 'react';
import { shallow } from 'enzyme';
import ChartPlugin from 'data-visualizer-plugin';
import { CHART, REPORT_TABLE } from '../../../../modules/itemTypes';
import { Item } from '../Item';
import DefaultPlugin from '../DefaultPlugin';

jest.mock('data-visualizer-plugin', () => () => <div />);
jest.mock('../DefaultPlugin', () => () => <div />);
jest.mock('../ItemFooter', () => () => <div />);
jest.mock('../plugin', () => {
    return {
        getLink: jest.fn(),
        unmount: jest.fn(),
        pluginIsAvailable: () => true,
        getName: () => 'rainbow',
        fetch: () => {},
        getVisualizationConfig: visualization => visualization,
    };
});

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
            itemFilters: {
                brilliance: [{ id: 100, name: '100' }],
            },
            visualization: {
                name: 'Test pivot',
                description: 'Test pivot mock',
                rows: [],
                columns: [],
                filters: [],
            },
            onToggleItemExpanded: jest.fn(),
            onVisualizationLoaded: jest.fn(),
        };
        shallowItem = undefined;
    });

    it('renders a ChartPlugin when a chart item is passed', () => {
        props.visualization = {
            name: 'Test chart',
            description: 'Test chart mock',
            rows: [],
            columns: [],
            filters: [],
        };
        props.item = {
            type: CHART,
            id: 'testItem1',
            chart: {
                id: 'chart1',
                name: 'Test chart',
            },
        };

        const expectedConfig = {
            ...props.visualization,
            id: undefined,
            filters: [
                {
                    dimension: 'brilliance',
                    items: props.itemFilters.brilliance,
                },
            ],
        };

        const component = canvas();

        component.setState({ configLoaded: true });

        const chartPlugin = component.find(ChartPlugin);

        expect(chartPlugin.exists()).toBeTruthy();
        expect(chartPlugin.prop('config')).toEqual(expectedConfig);
    });

    it('renders a DefaultPlugin when a item different from chart is passed', () => {
        const expectedConfig = {
            ...props.visualization,
            id: undefined,
            filters: [
                {
                    dimension: 'brilliance',
                    items: props.itemFilters.brilliance,
                },
            ],
        };

        expect(canvas()).toMatchSnapshot();

        const component = canvas();

        component.setState({ configLoaded: true });

        const defaultPlugin = canvas().find(DefaultPlugin);

        expect(defaultPlugin.exists()).toBeTruthy();
        expect(defaultPlugin.prop('visualization')).toEqual(expectedConfig);
    });
});
