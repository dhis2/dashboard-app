import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import DefaultPlugin from './DefaultPlugin'
import getVisualizationContainerDomId from '../getVisualizationContainerDomId'

const LegacyPlugin = ({
    availableHeight,
    availableWidth,
    gridWidth,
    isRecording,
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

    if (isRecording) {
        return <div />
    }

    return <DefaultPlugin {...props} />
}

LegacyPlugin.defaultValues = {
    isRecording: false,
}

LegacyPlugin.propTypes = {
    activeType: PropTypes.string,
    availableHeight: PropTypes.number,
    availableWidth: PropTypes.number,
    gridWidth: PropTypes.number,
    isFullscreen: PropTypes.bool,
    isRecording: PropTypes.bool,
    item: PropTypes.object,
}

export default LegacyPlugin
