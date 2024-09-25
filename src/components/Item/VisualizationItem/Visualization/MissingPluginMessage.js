import i18n from '@dhis2/d2-i18n'
import { Center } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { isPrintMode } from '../../../../modules/dashboardModes.js'
import { getAppName } from '../../../../modules/itemTypes.js'
import classes from './styles/VisualizationErrorMessage.module.css'

const MissingPluginMessage = ({ itemType, dashboardMode }) => {
    return (
        <Center>
            <p className={classes.errorMessage}>
                {i18n.t('The plugin for rendering this item is not available')}
            </p>
            {!isPrintMode(dashboardMode) ? (
                <p className={classes.appLink}>
                    <a
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        rel="noopener noreferrer"
                        href="/dhis-web-app-management/index.html#/app-hub"
                    >
                        {i18n.t(
                            'Install the {{appName}} app from the App Hub',
                            {
                                appName: getAppName(itemType),
                            }
                        )}
                    </a>
                </p>
            ) : null}
        </Center>
    )
}

MissingPluginMessage.propTypes = {
    dashboardMode: PropTypes.string,
    itemType: PropTypes.string,
}

export default MissingPluginMessage
