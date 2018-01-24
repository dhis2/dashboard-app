import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import ItemHeader from '../ItemHeader';

const getAppUrl = (appKey, context) => {
    if (!appKey) {
        return;
    }

    const app = context.d2.system.installedApps.find(
        app => app.folderName === appKey
    );

    if (app && app.launchUrl) {
        return app.launchUrl;
    }

    return;
};

const AppItem = ({ item }, context) => (
    <Fragment>
        <ItemHeader title={item.app.name} />
        <iframe
            title={item.app.name}
            className="dashboard-item-content"
            src={getAppUrl(item.app.appKey, context)}
        />
    </Fragment>
);

AppItem.contextTypes = {
    d2: PropTypes.object,
};

export default AppItem;
