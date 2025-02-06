import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { isPrintMode } from '../../../../modules/dashboardModes.js'
import { getAppName, itemTypeMap } from '../../../../modules/itemTypes.js'
import classes from './styles/VisualizationErrorMessage.module.css'

const getErrorIcon = () => (
    <svg
        height="96"
        viewBox="0 0 96 96"
        width="96"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g fill={colors.grey400} transform="translate(3 3)">
            <path d="m40.5 73.5000001c0 2.4852813 2.0147186 4.5 4.5 4.5s4.5-2.0147187 4.5-4.5c0-2.4142734-1.9012365-4.3844892-4.2881643-4.4951021l-.2128322-.0048979c-2.4848234.0005384-4.4990035 2.0150507-4.4990035 4.5z" />
            <path d="m48 60v-30c0-1.6568542-1.3431458-3-3-3s-3 1.3431458-3 3v30c0 1.6568542 1.3431458 3 3 3s3-1.3431458 3-3z" />
            <path d="m45-2.99904788c3.8985931 0 7.4578604 2.21715778 9.1770339 5.71709169l37.8912554 77.19048409c1.3845546 2.8165473 1.2171646 6.1482722-.4427191 8.811863-1.6598833 2.6635901-4.5771005 4.2816904-7.7135702 4.2796124h-77.82201115c-3.13845856.002078-6.05567574-1.6160223-7.71555901-4.2796124-1.65988369-2.6635908-1.82727377-5.9953157-.44346379-8.8103471l37.89234295-77.19269833c1.7188306-3.49923557 5.2780979-5.71639335 9.176691-5.71639335zm0 6c-1.6106864 0-3.0811818.91600885-3.7909661 2.36100407l-37.89274459 77.19351591c-.47005356.9562122-.41322496 2.0873262.15030227 2.99161.56352731.9042839 1.5539177 1.4529206 2.62140842 1.4529206h77.8259889c1.0655018 0 2.0558922-.5486367 2.6194195-1.4529206.5635272-.9042838.6203558-2.0353978.1495577-2.9931259l-37.8916571-77.19130167c-.7101272-1.44569356-2.1806226-2.36170241-3.791309-2.36170241z" />
        </g>
    </svg>
)

const VisualizationErrorMessage = ({
    itemType,
    dashboardMode,
    visualizationId,
}) => {
    const { baseUrl } = useConfig()

    const visHref = `${baseUrl}/${itemTypeMap[itemType].appUrl(
        visualizationId
    )}`

    return (
        <div className={classes.center}>
            {getErrorIcon()}
            <p className={classes.errorMessage}>
                {i18n.t('There was an error loading data for this item')}
            </p>
            {!isPrintMode(dashboardMode) ? (
                <p className={classes.appLink}>
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
                </p>
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
