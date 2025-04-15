import i18n from '@dhis2/d2-i18n'
import { Tag, Tooltip } from '@dhis2/ui'
import cx from 'classnames'
import React from 'react'
import { useSelector } from 'react-redux'
import { sGetSelectedIsEmbedded } from '../../../reducers/selected.js'
import classes from './styles/ExternalSourceTag.module.css'

const ExternalSourceTag = () => {
    const isEmbeddedDashboard = useSelector(sGetSelectedIsEmbedded)

    return (
        <Tooltip
            content={i18n.t(
                'This dashboard is showing data from outside this system'
            )}
            openDelay={200}
            closeDelay={100}
        >
            {(props) => (
                <div
                    className={cx(classes.externalSourceTag, {
                        [classes.padded]: isEmbeddedDashboard,
                    })}
                    {...props}
                >
                    <Tag maxWidth="200px">{i18n.t('External source')}</Tag>
                </div>
            )}
        </Tooltip>
    )
}

export default ExternalSourceTag
