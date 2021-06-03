import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import { Tag, Tooltip } from '@dhis2/ui'
import { useCacheableSectionStatus } from '../../../modules/useCacheableSectionStatus'
import { sGetCacheVersion } from '../../../reducers/cacheVersion'

import classes from './styles/LastUpdatedTag.module.css'

const LastUpdatedTag = ({ id, cacheVersion }) => {
    const { lastUpdated } = useCacheableSectionStatus(id)

    const i = 0
    if (i > 0) {
        console.log('cacheVersion', cacheVersion)
    }

    return lastUpdated ? (
        <Tooltip content={lastUpdated} openDelay={200} closeDelay={100}>
            <Tag
                className={classes.lastUpdatedTag}
            >{`Offline data last updated ${moment(
                lastUpdated
            ).fromNow()}`}</Tag>
        </Tooltip>
    ) : null
}
LastUpdatedTag.propTypes = {
    cacheVersion: PropTypes.number,
    id: PropTypes.string,
}

const mapStateToProps = state => ({
    cacheVersion: sGetCacheVersion(state),
})

export default connect(mapStateToProps, null)(LastUpdatedTag)
