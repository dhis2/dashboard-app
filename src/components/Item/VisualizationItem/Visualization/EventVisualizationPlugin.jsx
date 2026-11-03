import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, Cover, IconInfo24, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import {
    isIDVVersionCompatible,
    isLLVersionCompatible,
    minIDVVersion,
    minLLVersion,
} from '../../../../modules/isAppVersionCompatible.js'
import {
    EVENT_VISUALIZATION,
    getAppName,
} from '../../../../modules/itemTypes.js'
import { systemHasIdv } from '../../../../modules/serverVersion.js'
import {
    useInstalledIDVVersion,
    useInstalledLLVersion,
} from '../../../AppDataProvider/AppDataProvider.jsx'
import IframePlugin from './IframePlugin.jsx'
import { PluginWarningMessage } from './PluginWarningMessage.jsx'
import classes from './styles/Visualization.module.css'

const InstallAppMessage = ({ style, minVersion, serverVersion }) => (
    <PluginWarningMessage
        style={style}
        message={i18n.t(
            `Install {{appName}} app {{appVersion}} or higher in order to display this item.`,
            {
                appName: getAppName(EVENT_VISUALIZATION, serverVersion),
                appVersion: minVersion.join('.'),
            }
        )}
    />
)

InstallAppMessage.propTypes = {
    minVersion: PropTypes.array,
    serverVersion: PropTypes.object,
    style: PropTypes.object,
}

/* From 2.43.3 (see systemHasIdv) event visualizations are rendered by the
 * Individual Data Visualizer plugin, which fetches the visualization itself and shows its own
 * notice about unapplied filters. Below that they are rendered by the Line
 * Listing plugin, which is handed the visualization and relies on the
 * dashboard for that notice. */
const EventVisualizationPlugin = ({
    visualization,
    iFramePluginProps,
    style,
    showNoFiltersOverlay,
    onClickNoFiltersOverlay,
}) => {
    const { serverVersion } = useConfig()
    const idvAppVersion = useInstalledIDVVersion()
    const lineListingAppVersion = useInstalledLLVersion()

    if (systemHasIdv(serverVersion)) {
        return isIDVVersionCompatible(idvAppVersion) ? (
            <IframePlugin {...iFramePluginProps} />
        ) : (
            <InstallAppMessage
                style={style}
                minVersion={minIDVVersion}
                serverVersion={serverVersion}
            />
        )
    }

    return isLLVersionCompatible(lineListingAppVersion) ? (
        <>
            {showNoFiltersOverlay ? (
                <div style={style}>
                    <Cover>
                        <div className={classes.messageContent}>
                            <IconInfo24 color={colors.grey500} />
                            {i18n.t(
                                'Filters are not applied to line list dashboard items'
                            )}
                            <Button
                                secondary
                                small
                                onClick={onClickNoFiltersOverlay}
                            >
                                {i18n.t('Show without filters')}
                            </Button>
                        </div>
                    </Cover>
                </div>
            ) : null}
            <IframePlugin
                visualization={visualization}
                {...iFramePluginProps}
            />
        </>
    ) : (
        <InstallAppMessage
            style={style}
            minVersion={minLLVersion}
            serverVersion={serverVersion}
        />
    )
}

EventVisualizationPlugin.propTypes = {
    iFramePluginProps: PropTypes.object,
    showNoFiltersOverlay: PropTypes.bool,
    style: PropTypes.object,
    visualization: PropTypes.object,
    onClickNoFiltersOverlay: PropTypes.func,
}

export default EventVisualizationPlugin
