import { Tag } from '@dhis2-ui/tag'
import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Tooltip } from '@dhis2/ui'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { acSetOfflineDashboardStarred } from '../../../actions/offlineDashboards.js'
import { acSetSelectedStarred } from '../../../actions/selected.js'
import { sGetSelected } from '../../../reducers/selected.js'
import ActionsBar from './ActionsBar.js'
import { apiStarDashboard } from './apiStarDashboard.js'
import LastUpdatedTag from './LastUpdatedTag.js'
import StarDashboardButton from './StarDashboardButton.js'
import classes from './styles/InformationBlock.module.css'

const InformationBlock = () => {
    const dataEngine = useDataEngine()
    const dispatch = useDispatch()
    const { id, displayName, starred, embedded } = useSelector(sGetSelected)
    const isEmbeddedDashboard = !!embedded

    const { show: showAlert } = useAlert(
        ({ msg }) => msg,
        ({ isCritical }) =>
            isCritical ? { critical: true } : { warning: true }
    )
    const toggleDashboardStarred = useCallback(
        () =>
            apiStarDashboard(dataEngine, id, !starred)
                .then(() => {
                    dispatch(acSetSelectedStarred(!starred))
                    dispatch(
                        acSetOfflineDashboardStarred({ id, starred: !starred })
                    )
                })
                .catch(() => {
                    const msg = starred
                        ? i18n.t('Failed to unstar the dashboard')
                        : i18n.t('Failed to star the dashboard')
                    showAlert({ msg, isCritical: false })
                }),
        [dataEngine, id, showAlert, starred, dispatch]
    )

    if (!id) {
        return null
    }

    return (
        <div className={classes.container}>
            <div className={classes.titleContainer} data-test="title-bar">
                <h3 className={classes.title} data-test="view-dashboard-title">
                    {displayName}
                </h3>
                <StarDashboardButton
                    starred={starred}
                    onClick={toggleDashboardStarred}
                />
                <LastUpdatedTag id={id} />
                {isEmbeddedDashboard && (
                    <Tooltip
                        content={i18n.t(
                            'This dashboard is showing data from outside this system'
                        )}
                        openDelay={200}
                        closeDelay={100}
                    >
                        {(props) => (
                            <div {...props}>
                                <Tag maxWidth="200px">
                                    {i18n.t('External source')}
                                </Tag>
                            </div>
                        )}
                    </Tooltip>
                )}
            </div>
            <ActionsBar
                toggleDashboardStarred={toggleDashboardStarred}
                starred={starred}
                showAlert={showAlert}
            />
        </div>
    )
}

export default InformationBlock
