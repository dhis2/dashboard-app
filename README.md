![React 18](https://img.shields.io/badge/react-18-blue)
This project was bootstrapped with [DHIS2 Application Platform](https://github.com/dhis2/app-platform).

## Development

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

#### Configuration

##### api authentication: REACT_APP_DHIS2_AUTHORIZATION

In order for event reports and event charts to display in development mode, you need to set up the REACT_APP_DHIS2_AUTHORIZATION environment variable. The following example is the base64 encoded value for the username/password combination of `admin:district`:

```
REACT_APP_DHIS2_AUTHORIZATION=Basic YWRtaW46ZGlzdHJpY3Q=
```

### e2e tests

#### Configuration

Additional environment variables are needed in order to run the Cypress e2e tests. You can configure these in a local file `cypress.env.json`

```
{
    "dhis2BaseUrl": "https://test.e2e.dhis2.org/analytics-2.41",
    "dhis2InstanceVersion": "2.41",
    "dhis2Username": "admin",
    "dhis2Password": "district"
}
```

#### Run the e2e tests

The following commands can be used to run the tests:

| Comman         | Environment | Tests |
| -------------- | ----------: | ----: |
| `yarn cy:open` |  Cypress UI |   All |
| `yarn cy:run`  |    Headless |   All |

### `yarn test`

Launches the test runner and runs all available unit tests found in `/src`.<br />

See the section about [running tests](https://platform.dhis2.nu/#/scripts/test) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />. This command is run by the continuous integration server.

See the [building](https://platform.dhis2.nu/#/scripts/build) section for more information.

## Conditional E2E Test Recording

To record e2e tests in Cypress Cloud, you can use one of the following methods based on your needs:

-   **Commit Message**: Include `[e2e record]` in your commit messages to activate recording.
-   **GitHub Labels**: Apply the `e2e record` label to your pull request to trigger recording.

This setup helps in managing Cypress Cloud credits more efficiently, ensuring recordings are only made when explicitly required.

## Learn More

You can learn more about the platform in the [DHIS2 Application Platform Documentation](https://platform.dhis2.nu/).

You can learn more about the runtime in the [DHIS2 Application Runtime Documentation](https://runtime.dhis2.nu/).

To learn React, check out the [React documentation](https://reactjs.org/).
