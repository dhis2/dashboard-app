# Dashboards-app

[![Build Status](https://travis-ci.org/dhis2/dashboards-app.svg)](https://travis-ci.org/dhis2/dashboards-app)
[![Test Coverage](https://codeclimate.com/github/dhis2/dashboards-app/badges/coverage.svg)](https://codeclimate.com/github/dhis2/dashboards-app/coverage)
[![Code Climate](https://codeclimate.com/github/dhis2/dashboards-app/badges/gpa.svg)](https://codeclimate.com/github/dhis2/dashboards-app)

This repo contains the dashboards app first released in DHIS2 version 2.29.

It was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app), and later ejected.

## Developer guide

### Prerequisites

To use the dashboards-app in development mode, it is necessary to have a running DHIS2 instance, and be logged in to it. This is because the app requests resources, like react and react-dom, from the DHIS2 core resources. Most developers use their local DHIS2 instance. If you haven't configured your DHIS2_HOME env variable and set up a config.json, then the app will default to using localhost:8080 with the admin user (see
[config/webpack.config.dev.js](config/webpack.config.dev.js#L35)).

### Installation

First clone the repo, then:

```
yarn install
yarn start
```

The webpack-dev-server will start up on localhost:3000, by default.

### Running tests

`yarn test or yarn coverage`

### Other useful things to know

#### eslint/prettier

The dashboards-app uses **eslint** for code correctness checking, and **prettier** for formatting, and the build will fail if any of the checks fail. To make life easier, we suggest that you add the eslint and prettier plugins to your editor. But if you prefer, you can run the following before pushing your code:

```
yarn lint
yarn prettify
```

#### d2/d2-ui

The dashboards-app uses the d2 library for communicating with the DHIS2 api. And as much as possible, we use d2-ui components, rather than using material-ui directly. Make sure to upgrade these dependencies regularly, and contribute to them.

### Deploy

#### Local deployment

The instructions here assume a good understanding of building DHIS2 locally.

Build the dashboards-app locally

```
yarn build
```

Then copy the contents of the /build folder to your .m2 directory. Then run:

```
mvn install -o
```

#### Deploy to production

To deploy a build for an existing version, e.g., 2.29 do the following:

```
git checkout master
git pull
yarn version (interactive, will ask you for a new version number, eg. 29.0.21)
git push origin master
git push origin v29.0.21
```

To deploy a major upgrade, it is necessary to branch the current version, and update the pom.xml. Details of this will be provided elsewhere.
