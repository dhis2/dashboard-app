import { configure } from '@testing-library/dom'
import '@testing-library/jest-dom'
import ResizeObserver from 'resize-observer-polyfill'
import 'jest-webgl-canvas-mock'

global.ResizeObserver = ResizeObserver

// Emulate CSS.supports API
// Needed with Highcharts >= 12.2.0
// See: https://github.com/highcharts/highcharts/issues/22910
global.CSS.supports = () => true

configure({
    testIdAttribute: 'data-test',
})
