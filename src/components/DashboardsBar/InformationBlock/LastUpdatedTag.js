import i18n from '@dhis2/d2-i18n'
import { Tag, Tooltip } from '@dhis2/ui'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import { useWindowDimensions } from '../../../components/WindowDimensionsProvider.js'
import { useCacheableSection } from '../../../modules/useCacheableSection.js'

const LastUpdatedTag = ({ id }) => {
    const { lastUpdated } = useCacheableSection(id)
    const { width } = useWindowDimensions()

    if (!lastUpdated) {
        return null
    }

    const timeAgo = moment(lastUpdated).fromNow()
    const message =
        width > 480
            ? i18n.t('Offline data last updated {{timeAgo}}', {
                  timeAgo,
              })
            : i18n.t('Synced {{timeAgo}}', { timeAgo })

    return (
        <Tooltip
            content={moment(lastUpdated).format('llll')}
            openDelay={200}
            closeDelay={100}
        >
            {(props) => (
                <div {...props}>
                    <Tag maxWidth="400px">{message} </Tag>
                </div>
            )}
        </Tooltip>
    )
}

LastUpdatedTag.propTypes = {
    id: PropTypes.string,
}

export default LastUpdatedTag
