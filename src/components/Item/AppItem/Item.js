import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NotInterestedIcon from '@material-ui/icons/NotInterested';

import { FILTER_USER_ORG_UNIT } from '../../../actions/itemFilter';
import { sGetItemFilterRoot } from '../../../reducers/itemFilter';
import ItemHeader from '../ItemHeader';
import Line from '../../../widgets/Line';

const getIframeSrc = (appDetails, item, itemFilter) => {
    let iframeSrc = `${appDetails.launchUrl}?dashboardItemId=${item.id}`;

    if (
        itemFilter &&
        itemFilter[FILTER_USER_ORG_UNIT] &&
        itemFilter[FILTER_USER_ORG_UNIT].length
    ) {
        const ouIds = itemFilter[FILTER_USER_ORG_UNIT].map(
            ouPath => ouPath.split('/').slice(-1)[0]
        );

        iframeSrc += `&userOrgUnit=${ouIds.join(',')}`;
    }

    return iframeSrc;
};

const AppItem = ({ item, itemFilter }, context) => {
    let appDetails;

    const appKey = item.appKey;

    if (appKey) {
        appDetails = context.d2.system.installedApps.find(
            app => app.key === appKey
        );
    }

    return appDetails && appDetails.name && appDetails.launchUrl ? (
        <Fragment>
            <ItemHeader title={appDetails.name} />
            <Line />
            <iframe
                title={appDetails.name}
                src={getIframeSrc(appDetails, item, itemFilter)}
                className="dashboard-item-content"
                style={{ border: 'none' }}
            />
        </Fragment>
    ) : (
        <Fragment>
            <ItemHeader title={`${appKey} app not found`} />
            <Line />
            <div
                className="dashboard-item-content"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '90%',
                }}
            >
                <NotInterestedIcon
                    color="disabled"
                    disabled
                    style={{ width: 100, height: 100, align: 'center' }}
                />
            </div>
        </Fragment>
    );
};

AppItem.contextTypes = {
    d2: PropTypes.object,
};

const mapStateToProps = state => ({
    itemFilter: sGetItemFilterRoot(state),
});

export default connect(mapStateToProps)(AppItem);
