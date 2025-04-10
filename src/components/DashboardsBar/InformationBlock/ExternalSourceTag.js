import i18n from '@dhis2/d2-i18n'
import { Tag, Tooltip } from '@dhis2/ui'
import React from 'react'
import classes from './styles/LastUpdatedTag.module.css'

const ExternalSourceTag = () => (
    <Tooltip
        content={i18n.t(
            'This dashboard is showing data from outside this system'
        )}
        openDelay={200}
        closeDelay={100}
    >
        {(props) => (
            <div className={classes.lastUpdatedTag} {...props}>
                <Tag maxWidth="200px">{i18n.t('External source')}</Tag>
            </div>
        )}
    </Tooltip>
)

export default ExternalSourceTag
