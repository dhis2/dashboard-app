import React from 'react'
import * as PropTypes from 'prop-types'
import { useD2 } from './useD2'

export const D2Shim = ({ children, onInitialized, d2Config }) => {
    const { d2, d2Error } = useD2({ onInitialized, d2Config })

    return children({ d2, d2Error })
}

D2Shim.propTypes = {
    onInitialized: PropTypes.func,
    d2Config: PropTypes.object,
    children: PropTypes.func.isRequired,
}
