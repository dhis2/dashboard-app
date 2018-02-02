# Dashboards-app


[![Build Status](https://travis-ci.org/dhis2/dashboards-app.svg)](https://travis-ci.org/dhis2/dashboards-app)
[![Test Coverage](https://codeclimate.com/github/dhis2/dashboards-app/badges/coverage.svg)](https://codeclimate.com/github/dhis2/dashboards-app/coverage)
[![Code Climate](https://codeclimate.com/github/dhis2/dashboards-app/badges/gpa.svg)](https://codeclimate.com/github/dhis2/dashboards-app)

This repo contains the dashboards app first released in DHIS2 version 2.29.

It was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app), and later ejected.

##Developer guide

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

 ```yarn test or yarn coverage```


### Other useful things to know
The dashboards-app uses __eslint__ for code correctness checking, and __prettier__ for formatting, and the build will fail if any of the checks fail. To make life easier, we suggest that you add the eslint and prettier plugins to your editor. But if you prefer, you can run these before pushing your code:

```
yarn lint
yarn prettify
```
### Deploying to Sonatype

When deploying the dashboards-app for DHIS2 releases, the build is pushed to Sonatype, which builds a jar artifact, and DHIS2 picks it up from there. The dashboards-app contains a [pom.xml](pom.xml) file. When it is time for release of a new version (example 2.29 below), do the following:

1. Checkout master branch and git pull to get the latest. ```git checkout master && git pull```
2. Update the __version__ property to 2.29-SNAPSHOT. (Always include "-SNAPSHOT").
3. Commit and push to master.
4. Still on master, create a git tag v2.29.0 ```git tag v2.29.0```
5. Push the new tag ```git push origin v2.29.0```
6. Travis will detect the new tag and do a fresh build and deploy to Sonatype.

