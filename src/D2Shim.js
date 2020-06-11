/* eslint-disable */
import React from 'react'
import * as PropTypes from 'prop-types'
import { useD2 } from './useD2'

export const D2Shim = ({ appConfig, onInitialized, children }) => {
    const { d2, d2Error } = useD2({ appConfig, onInitialized })

    return children({ d2, d2Error })
}

D2Shim.propTypes = {
    onInitialized: PropTypes.func,
    appConfig: PropTypes.object,
    children: PropTypes.func.isRequired,
}
/* eslint-enable */
