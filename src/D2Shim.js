import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useConfig } from '@dhis2/app-runtime'

import { init as d2Init, config as d2Config, getUserSettings } from 'd2'

import { ScreenCover, CircularLoader } from '@dhis2/ui-core'

const configI18n = async userSettings => {
    const uiLocale = userSettings.uiLocale

    // TODO: Remove and port to modern i18n
    if (uiLocale && uiLocale !== 'en') {
        d2Config.i18n.sources.add(
            `./i18n_old/i18n_module_${uiLocale}.properties`
        )
    }

    d2Config.i18n.sources.add('./i18n_old/i18n_module_en.properties')
}

const initD2 = async ({ baseUrl, apiVersion }, initConfig) => {
    const apiUrl = `${baseUrl}/api/${apiVersion}`

    d2Config.baseUrl = apiUrl

    const userSettings = await getUserSettings()
    await configI18n(userSettings)

    const d2 = await d2Init({
        ...initConfig,
        baseUrl: apiUrl,
    })

    return { baseUrl, d2, userSettings }
}

export const D2Shim = ({ children, ...initConfig }) => {
    const appConfig = useConfig()
    const [params, setParams] = useState(null)

    useEffect(() => {
        initD2(appConfig, initConfig).then(setParams)
    }, []) /* eslint-disable-line react-hooks/exhaustive-deps */

    if (!params) {
        return (
            <ScreenCover>
                <CircularLoader />
            </ScreenCover>
        )
    }
    return children(params)
}

D2Shim.propTypes = {
    children: PropTypes.func,
}
