This project was bootstrapped with [DHIS2 Application Platform](https://github.com/dhis2/app-platform).

## Development

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

#### Configuration

Two environment variables need to be set for running dashboards-app in development mode. It is recommended to set these environment variables in a `.env` or `.env.local` file.

##### api base url: REACT_APP_DHIS2_BASE_URL

The api base url points to a running DHIS2 instance. This can be for example `http://localhost:8080`.

```
REACT_APP_DHIS2_BASE_URL=http://localhost:8080
```

##### api authentication: REACT_APP_DHIS2_AUTHORIZATION

In order for maps, event reports and event charts to display in development mode, you also need to provide the authenticaion credentials for the api. The following example is the base64 encoded value for the username/password combination of `admin:district`:

```
REACT_APP_DHIS2_AUTHORIZATION=Basic YWRtaW46ZGlzdHJpY3Q=
```

### e2e tests

#### Configuration

Additional environment variables are needed in order to run the Cypress e2e tests. It is recommended to define these in the same place as the REACT_APP_DHIS2_BASE_URL env var (for example. `.env`). REACT_APP_DHIS2_BASE_URL and CYPRESS_DHIS2_BASE_URL must match.

```
REACT_APP_DHIS2_BASE_URL=http://localhost:8080
CYPRESS_DHIS2_BASE_URL=http://localhost:8080
CYPRESS_DHIS2_USERNAME=admin
CYPRESS_DHIS2_PASSWORD=district
```

#### Run the e2e tests

The following commands can be used to run the tests:

| Command             |  Backend   | Environment |        Tests |
| ------------------- | :--------: | ----------: | -----------: |
| `yarn cy:open-live` | API server |  Cypress UI |          All |
| `yarn cy:run-live`  | API server |    Headless |          All |
| `yarn cy:open-stub` |  Fixtures  |  Cypress UI | Non-mutating |
| `yarn cy:run-stub`  |  Fixtures  |    Headless | Non-mutating |

### `yarn test`

Launches the test runner and runs all available unit tests found in `/src`.<br />

See the section about [running tests](https://platform.dhis2.nu/#/scripts/test) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />. This command is run by the continuous integration server.

See the [building](https://platform.dhis2.nu/#/scripts/build) section for more information.

## Learn More

You can learn more about the platform in the [DHIS2 Application Platform Documentation](https://platform.dhis2.nu/).

You can learn more about the runtime in the [DHIS2 Application Runtime Documentation](https://runtime.dhis2.nu/).

To learn React, check out the [React documentation](https://reactjs.org/).
