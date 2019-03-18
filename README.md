# Dashboards-app

[![Build Status](https://travis-ci.com/dhis2/dashboards-app.svg)](https://travis-ci.com/dhis2/dashboards-app)

This repo contains the dashboards app first released in DHIS2 version 2.29.

It was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app), and later ejected.

## Developer guide

### Prerequisites

To use the dashboards-app in development mode, it is necessary to have a running DHIS2 instance, and be logged in to it. This is because the app requests resources, like maps plugin, from the DHIS2 core resources. Most developers use their local DHIS2 instance.

The following env vars need to be set when running in dev mode:

-   REACT_APP_DHIS2_BASE_URL (e.g., http://localhost:8080)
-   REACT_APP_DHIS2_AUTHORIZATION (base64 encoded username and password)

The defaults for these values (for development) are set in the `.env` and can be overriden in `.env.local` (which should not be checked into source control)
When creating a production build, the REACT_APP_DHIS2_BASE_URL is set to `..` in `.env.production`. `REACT_APP_DHIS2_AUTHORIZATION` is unset by default.

### Installation

First clone the repo, then:

```
yarn install
yarn start
```

The webpack-dev-server will start up on localhost:3000, by default.

### Running tests

`yarn test or yarn coverage`

### Manual testing with Netlify

This repo is configured to deploy all branches to netlify. This makes it simple to share a running implementation with others (e.g., tester, product manager, ux, fellow developers) prior
to merging to master.

All netlify deployments run against play.dhis2.org/dev, so in order to use them, you must configure CORS for your particular branch:

1. Copy the URL of the deployment you want to enable, i.e. `https://dhis2-dashboards.netlify.com`
2. Visit the play/dev [system settings -- access](https://play.dhis2.org/dev/dhis-web-settings/index.html#/access) page
3. Add the copied URL on a new line the in CORS Whitelist textbox **NOTE**: do NOT include a trailing slash

The master branch is always available at:

`https://dhis2-dashboards.netlify.com`

Branches are available at (replace `/` and other special characters in `{branchname}` with `-`):

`https://{branchname}--dhis2-dashboards.netlify.com`

Pull requests (e.g., #209) are available at:

`https://deploy-preview-209--dhis2-dashboards.netlify.com`

Netlify will also add a status check to each PR which links directly to the PR deployment.

### Other useful things to know

#### eslint/prettier

The dashboards-app uses **eslint** for code correctness checking, and **prettier** for formatting, and the build will fail if any of the checks fail. To make life easier, we suggest that you add the eslint and prettier plugins to your editor. But if you prefer, you can run the following before pushing your code:

```
yarn lint
```

### Deploy

#### Local deployment

In order to test the build of the dashboards-app (rather than just the dev server), deploy it to your local dhis2 build. The instructions here assume a good understanding of building DHIS2 locally.

From the root of the dashboards-app, build the dashboards-app locally

```
yarn build
```

Then copy the contents of the /build folder to your .m2 directory. Then run:

```
mvn install
```

Navigate to your local dhis2 repo, dhis-web-apps directory. Then run

```
mvn clean install -o
```

#### Deploy to production

Every commit to master is automatically deployed. To deploy a build to an older dashboards-app version, e.g., 2.29, a tag needs to be created. Do the following:

```
git checkout 2.29
git pull
yarn version (interactive, will ask you for a new version number, eg. 29.0.22)
git push origin master
git push origin v29.0.22 (pushes the v29.0.22 tag)
```

To deploy a major upgrade, it is necessary to branch the current version, and update the pom.xml on master. Details of this will be provided elsewhere.
