import { useState, useEffect } from 'react'
import { init as initD2 } from 'd2'
import { useConfig } from '@dhis2/app-runtime'

let theD2 = null

export const useD2 = ({ d2Config = {}, onInitialized = () => {} }) => {
    const { baseUrl, apiVersion } = useConfig()
    const [d2, setD2] = useState(theD2)
    const [d2Error, setError] = useState(undefined)

    useEffect(() => {
        if (!theD2) {
            initD2({
                appUrl: baseUrl,
                baseUrl: `${baseUrl}/api/${apiVersion}`,
                ...d2Config,
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
