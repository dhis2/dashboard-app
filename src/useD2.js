import { useState, useEffect } from 'react'
import { init as d2Init, config as d2Config, getUserSettings } from 'd2'
import { useConfig } from '@dhis2/app-runtime'

let theD2 = null

const configI18n = async (baseUrl, i18nRoot) => {
    d2Config.baseUrl = baseUrl

    const settings = await getUserSettings()

    if (settings.keyUiLocale && settings.keyUiLocale !== 'en') {
        await d2Config.i18n.sources.add(
            `${i18nRoot}/i18n_module_${settings.keyUiLocale}.properties`
        )
    }

    await d2Config.i18n.sources.add('${i18nRoot}/i18n_module_en.properties')
}

const initD2 = async ({ appUrl, baseUrl, appConfig }) => {
    const { i18nRoot, ...initConfig } = appConfig

    if (i18nRoot) {
        await configI18n(baseUrl, i18nRoot)
    }

    return await d2Init({
        appUrl,
        baseUrl,
        ...initConfig,
    })
}

export const useD2 = ({
    appConfig = {},
    onInitialized = Function.prototype,
}) => {
    const { baseUrl, apiVersion } = useConfig()
    const [d2, setD2] = useState(theD2)
    const [d2Error, setError] = useState(undefined)

    useEffect(() => {
        if (!theD2) {
            initD2({
                appUrl: baseUrl,
                baseUrl: `${baseUrl}/api/${apiVersion}`,
                appConfig,
            })
                .then(async d2 => {
                    await onInitialized(d2)
                    theD2 = d2
                    setD2(d2)
                })
                .catch(setError)
        }
    }, [])

    return { d2, d2Error } // d2 is null while loading
}
