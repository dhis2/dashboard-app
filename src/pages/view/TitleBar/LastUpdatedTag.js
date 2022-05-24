import i18n from '@dhis2/d2-i18n'
import { Tag, Tooltip } from '@dhis2/ui'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import { useCacheableSection } from '../../../modules/useCacheableSection.js'
import classes from './styles/LastUpdatedTag.module.css'

const LastUpdatedTag = ({ id }) => {
    const { lastUpdated } = useCacheableSection(id)

    return lastUpdated?.toString ? (
        <Tooltip
            content={<span>{moment(lastUpdated).format('llll')}</span>}
            openDelay={200}
            closeDelay={100}
        >
            <Tag className={classes.lastUpdatedTag} maxWidth="400px">
                {i18n.t('Offline data last updated {{time}}', {
                    time: moment(lastUpdated).fromNow(),
                })}
            </Tag>
        </Tooltip>
    ) : null
}
LastUpdatedTag.propTypes = {
    id: PropTypes.string,
}

export default LastUpdatedTag
