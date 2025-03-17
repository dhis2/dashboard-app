import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { IconWarning24, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { isPrintMode } from '../../../modules/dashboardModes.js'
import { getAppName, itemTypeMap } from '../../../modules/itemTypes.js'
import classes from './styles/ItemMessage.module.css'

const VisualizationErrorMessage = ({
    itemType,
    dashboardMode,
    visualizationId,
}) => {
    const { baseUrl, apiVersion } = useConfig()

    const visHref = `${baseUrl}/${itemTypeMap[itemType].appUrl({
        id: visualizationId,
        apiVersion,
    })}`

    return (
        <div className={classes.messageContent}>
            <IconWarning24 color={colors.grey500} />
            <span>
                {i18n.t('There was an error loading data for this item')}
            </span>
            {!isPrintMode(dashboardMode) ? (
                <span className={classes.appLink}>
                    <a
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        rel="noopener noreferrer"
                        href={visHref}
                    >
                        {i18n.t('Open this item in {{appName}}', {
                            appName: getAppName(itemType),
                        })}
                    </a>
                </span>
            ) : null}
        </div>
    )
}

VisualizationErrorMessage.propTypes = {
    dashboardMode: PropTypes.string,
    itemType: PropTypes.string,
    visualizationId: PropTypes.string,
}

export default VisualizationErrorMessage
