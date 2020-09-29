/* eslint-disable */
const HEADERS_TO_STRIP_LOWERCASE = [
    'content-security-policy',
    'x-frame-options',
];

chrome.webRequest.onHeadersReceived.addListener(
    details => ({
        responseHeaders: details.responseHeaders.filter(header => HEADERS_TO_STRIP_LOWERCASE.indexOf(header.name.toLowerCase()) < 0),
    }), {
        urls: ['<all_urls>'],
    }, ['blocking', 'responseHeaders']);

