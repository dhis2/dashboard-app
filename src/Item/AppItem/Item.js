import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ItemHeader from '../ItemHeader';
import Line from '../../widgets/Line';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';

import { fromItemFilter } from '../../reducers';
import { FILTER_USER_ORG_UNIT } from '../../actions/itemFilter';

const AppItem = ({ item, itemFilter }, context) => {
    let appDetails;

    const appKey = item.appKey;

    if (appKey) {
        appDetails = context.d2.system.installedApps.find(
            app => app.folderName === appKey
        );
    }

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

    return appDetails && appDetails.name && appDetails.launchUrl ? (
        <Fragment>
            <ItemHeader title={appDetails.name} />
            <Line />
            <iframe
                title={appDetails.name}
                src={iframeSrc}
                className="dashboard-item-content"
                style={{
                    border: 'none',
                }}
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
                <SvgIcon
                    icon="NotInterested"
                    style={{ width: 100, height: 100, align: 'center' }}
                    disabled
                />
            </div>
        </Fragment>
    );
};

AppItem.contextTypes = {
    d2: PropTypes.object,
};

const mapStateToProps = state => ({
    itemFilter: fromItemFilter.sGetFromState(state),
});

export default connect(mapStateToProps)(AppItem);
