import i18n from '@dhis2/d2-i18n'
import { Cover, IconWarning24, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { isPrintMode } from '../../../modules/dashboardModes.js'
import classes from './styles/ItemMessage.module.css'

const MissingPluginMessage = ({ dashboardMode, pluginName }) => {
    return (
        <Cover>
            <div className={classes.messageContent}>
                <IconWarning24 color={colors.grey500} />
                <span>
                    {i18n.t(
                        'The plugin for rendering this item is not available'
                    )}
                </span>
                {!isPrintMode(dashboardMode) ? (
                    <span className={classes.appLink}>
                        <a
                            onClick={(e) => e.stopPropagation()}
                            target="_blank"
                            rel="noopener noreferrer"
                            href="/dhis-web-app-management/index.html#/app-hub"
                        >
                            {i18n.t(
                                'Install the {{pluginName}} plugin from the App Hub',
                                {
                                    pluginName,
                                }
                            )}
                        </a>
                    </span>
                ) : null}
            </div>
        </Cover>
    )
}

MissingPluginMessage.propTypes = {
    dashboardMode: PropTypes.string,
    pluginName: PropTypes.string,
}

export default MissingPluginMessage
