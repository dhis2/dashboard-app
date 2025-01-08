import { configure } from '@testing-library/dom'
import '@testing-library/jest-dom'
import ResizeObserver from 'resize-observer-polyfill'

global.ResizeObserver = ResizeObserver

configure({
    testIdAttribute: 'data-test',
})
