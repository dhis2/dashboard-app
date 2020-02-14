import React from 'react';
import { shallow } from 'enzyme';
import VisualizationPlugin from '@dhis2/data-visualizer-plugin';
import {
    CHART,
    REPORT_TABLE,
    EVENT_CHART,
} from '../../../../modules/itemTypes';
import { Item } from '../Item';
import DefaultPlugin from '../DefaultPlugin';

jest.mock('@dhis2/data-visualizer-plugin', () => () => <div />); // eslint-disable-line react/display-name
jest.mock('../DefaultPlugin', () => () => <div />); // eslint-disable-line react/display-name
jest.mock('../ItemFooter', () => () => <div />); // eslint-disable-line react/display-name
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
            item: {},
            editMode: false,
            itemFilters: {
                brilliance: [{ id: 100, name: '100' }],
            },
            visualization: {
                name: 'vis name',
                id: 'vis id',
                description: 'vis description',
                rows: [],
                columns: [],
                filters: [],
            },
            onToggleItemExpanded: jest.fn(),
            onVisualizationLoaded: jest.fn(),
        };
        shallowItem = undefined;
    });

    it('renders a VisualizationPlugin when a CHART is passed', () => {
        props.item.type = CHART;
        props.item.chart = {
            id: 'chart1',
            name: 'Test chart',
        };

        const expectedConfig = {
            ...props.visualization,
            filters: [
                {
                    dimension: 'brilliance',
                    items: props.itemFilters.brilliance,
                },
            ],
        };

        const component = canvas();

        component.setState({ configLoaded: true });

        const visPlugin = component.find(VisualizationPlugin);

        expect(visPlugin.exists()).toBeTruthy();
        expect(visPlugin.prop('visualization')).toEqual(expectedConfig);
    });

    it('renders a VisualizationPlugin when a REPORT_TABLE is passed', () => {
        props.item.type = REPORT_TABLE;
        props.item.reportTable = {
            id: 'table1',
            name: 'Test table',
        };

        const expectedConfig = {
            ...props.visualization,
            filters: [
                {
                    dimension: 'brilliance',
                    items: props.itemFilters.brilliance,
                },
            ],
        };

        const component = canvas();

        component.setState({ configLoaded: true });

        const visPlugin = component.find(VisualizationPlugin);

        expect(visPlugin.exists()).toBeTruthy();
        expect(visPlugin.prop('visualization')).toEqual(expectedConfig);
    });

    it('renders a DefaultPlugin when an EVENT_CHART is passed', () => {
        props.item.type = EVENT_CHART;
        props.item.eventChart = {
            id: 'evchart1',
            name: 'Test evchart',
        };
        const expectedConfig = {
            ...props.visualization,
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
