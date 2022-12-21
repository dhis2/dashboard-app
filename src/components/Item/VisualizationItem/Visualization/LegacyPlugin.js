import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import getVisualizationContainerDomId from '../getVisualizationContainerDomId.js'
import DefaultPlugin from './DefaultPlugin.js'

const LegacyPlugin = ({
    availableHeight,
    availableWidth,
    gridWidth,
    ...props
}) => {
    useEffect(() => {
        const el = document.querySelector(
            `#${getVisualizationContainerDomId(props.item.id)}`
        )
        if (typeof el?.setViewportSize === 'function') {
            setTimeout(
                () =>
                    el.setViewportSize(el.clientWidth - 5, el.clientHeight - 5),
                10
            )
        }
    }, [availableHeight, availableWidth, gridWidth])

    return <DefaultPlugin {...props} />
}

LegacyPlugin.propTypes = {
    activeType: PropTypes.string,
    availableHeight: PropTypes.number,
    availableWidth: PropTypes.number,
    gridWidth: PropTypes.number,
    isFullscreen: PropTypes.bool,
    item: PropTypes.object,
}

export default LegacyPlugin
