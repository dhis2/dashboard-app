import { getFileName } from './utils.js'

export default class NetworkShim {
    constructor(hosts) {
        this.state = null
        this.hosts = hosts
    }

    initCaptureMode() {
        this.state = {
            totalSize: 0,
            duplicates: 0,
            nonDeterministicResponses: 0,
            requests: {},
        }
    }

    initStubMode() {
        cy.readFile(getFileName()).then(file => {
            this.state = {
                requests: this.parseFileRequests(file.requests),
            }
        })
    }

    parseFileRequests(requests) {
        return requests.reduce((acc, request) => {
            const { method, path, requestBody } = request
            const key = this.createKey(method, path, requestBody)
            request.response = JSON.parse(request.response)
            acc[key] = request
            return acc
        }, {})
    }

    captureRequestsAndResponses() {
        cy.server({
            onAnyRequest: this.captureRequest,
            onAnyResponse: this.captureResponse,
        })
    }

    createStubRoutes() {
        cy.server()
        Object.values(this.state.requests).forEach(stub => {
            cy.route({
                url: Cypress.env('dhis2_base_url') + stub.path,
                method: stub.method,
                /* 
                TODO: for POST / PUT requests we will quite likely have to
                be able to differentiate between different request bodies
                specifying a body in the route options could theoretically be
                a way to do so, but quite likely it doesn't work. I have posted
                a question on Stackoverlflow about this topic:
                https://stackoverflow.com/questions/62530197/how-to-access-request-body-in-cy-route-response-callback
                */
                body: stub.requestBody || undefined,
                response: stub.response,
            })
        })
    }

    processRequest(xhr) {
        const host = this.hosts.find(host => xhr.url.indexOf(host) === 0)
        const path = xhr.url.substr(host.length)
        const key = this.createKey(xhr.method, path, xhr.request.body)

        return { host, path, key }
    }

    createKey(method, path, requestBody) {
        const sections = [method, path]

        if (requestBody) {
            sections.push(JSON.stringify(requestBody))
        }

        return sections.join('__')
    }

    captureRequest = (_, xhr) => {
        const { host, path, key } = this.processRequest(xhr)
        if (!host) {
            // pass through
            return xhr
        }

        if (this.state.requests[key]) {
            // Repeated request
            this.state.requests[key].count += 1
            this.state.duplicates += 1
        } else {
            // New request
            this.state.requests[key] = {
                path,
                method: xhr.method,
                requestBody: xhr.request.body,
                count: 1,
                response: null,
            }
        }
        return xhr
    }

    captureResponse = async (_, xhr) => {
        const { host, key } = this.processRequest(xhr)
        if (!host) {
            // pass through
            return xhr
        }

        const stateRequest = this.state.requests[key]
        const { size, text } = await this.createResponseBlob(xhr)

        if (stateRequest.response) {
            if (text !== stateRequest.response) {
                this.state.nonDeterministicResponses += 1
                stateRequest.nonDeterministic = true
            }
        } else {
            // TODO: Capture response headers
            stateRequest.response = text
            stateRequest.size = size

            this.state.totalSize += size
        }

        return xhr
    }

    async createResponseBlob(xhr) {
        const responseBodyStr = JSON.stringify(xhr.response.body)
        const blob = new Blob([responseBodyStr], { type: 'application/json' })
        const size = blob.size
        const text = await blob.text()

        return { size, text }
    }

    writeFile() {
        const requestArray = Object.values(this.state.requests)
        cy.log(
            `Networkshim successfully captured ${requestArray.length} requests`,
            this.state
        )
        cy.writeFile(getFileName(), {
            ...this.state,
            requests: requestArray,
        })
    }
}
