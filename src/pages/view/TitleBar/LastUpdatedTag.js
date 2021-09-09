import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import getCacheableSectionId from '../../../modules/getCacheableSectionId'
import { useCacheableSection } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Tag, Tooltip } from '@dhis2/ui'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
// import { useCacheableSection } from '../../../modules/useCacheableSection'
import classes from './styles/LastUpdatedTag.module.css'

const LastUpdatedTag = ({ id }) => {
    const { d2 } = useD2()
    const cId = getCacheableSectionId(d2.currentUser.id, id)
    const { lastUpdated } = useCacheableSection(cId)

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
