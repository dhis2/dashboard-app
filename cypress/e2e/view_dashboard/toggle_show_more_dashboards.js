import { getApiBaseUrl } from '../../support/utils.js'

const RESP_CODE_200 = 200
const RESP_CODE_201 = 201

beforeEach(() => {
    cy.request({
        method: 'PUT',
        url: `${getApiBaseUrl()}/api/userDataStore/dashboard/controlBarRows`,
        headers: {
            'content-type': 'application/json',
        },
        body: '1',
    }).then((response) =>
        expect(response.status).to.be.oneOf([RESP_CODE_201, RESP_CODE_200])
    )
})
