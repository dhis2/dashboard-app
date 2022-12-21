import { getVisualizationFromItem } from '../item.js'
import { VISUALIZATION, MAP, EVENT_REPORT, EVENT_CHART } from '../itemTypes.js'

test('getVisualizationFromItem for chart', () => {
    const vis = 'chart visualization'
    const item = {
        type: VISUALIZATION,
        visualization: vis,
    }

    expect(getVisualizationFromItem(item)).toEqual(vis)
})

test('getVisualizationFromItem for table', () => {
    const vis = 'table visualization'
    const item = {
        type: VISUALIZATION,
        visualization: vis,
    }

    expect(getVisualizationFromItem(item)).toEqual(vis)
})

test('getVisualizationFromItem for map', () => {
    const vis = 'map visualization'
    const item = {
        type: MAP,
        map: vis,
    }

    expect(getVisualizationFromItem(item)).toEqual(vis)
})

test('getVisualizationFromItem for event report', () => {
    const vis = 'event report visualization'
    const item = {
        type: EVENT_REPORT,
        eventReport: vis,
    }

    expect(getVisualizationFromItem(item)).toEqual(vis)
})

test('getVisualizationFromItem for event chart', () => {
    const vis = 'event chart visualization'
    const item = {
        type: EVENT_CHART,
        eventChart: vis,
    }

    expect(getVisualizationFromItem(item)).toEqual(vis)
})

test('getVisualizationFromItem for unknown', () => {
    const item = {
        type: 'unknown',
    }

    expect(getVisualizationFromItem(item)).toEqual({})
})

test('getVisualizationFromItem for non object', () => {
    const item = 'not an object'

    expect(getVisualizationFromItem(item)).toEqual(null)
})
