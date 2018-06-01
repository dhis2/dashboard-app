import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import ItemHeader from '../ItemHeader'
import Line from '../../widgets/Line'
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon'

const AppItem = ({ item }, context) => {
    let appDetails

    if (item.appKey) {
        appDetails = context.d2.system.installedApps.find(
            app => app.folderName === item.appKey
        )
    }

    return appDetails && appDetails.name && appDetails.launchUrl ? (
        <Fragment>
            <ItemHeader title={appDetails.name} />
            <Line />
            <iframe
                title={appDetails.name}
                src={appDetails.launchUrl}
                className="dashboard-item-content"
                style={{
                    border: 'none'
                }}
            />
        </Fragment>
    ) : (
        <Fragment>
            <ItemHeader title={`${item.appKey} app not found`} />
            <Line />
            <div
                className="dashboard-item-content"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '90%'
                }}
            >
                <SvgIcon
                    icon="NotInterested"
                    style={{ width: 100, height: 100, align: 'center' }}
                    disabled
                />
            </div>
        </Fragment>
    )
}

AppItem.contextTypes = {
    d2: PropTypes.object
}

export default AppItem
