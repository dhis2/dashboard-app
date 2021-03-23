import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import DefaultPlugin from './DefaultPlugin'
import getGridItemDomId from '../../../../modules/getGridItemDomId'

const LegacyPlugin = ({
    isFullscreen,
    availableHeight,
    availableWidth,
    gridWidth,
    ...props
}) => {
    useEffect(() => {
        const el = document.querySelector(`#${getGridItemDomId(props.item.id)}`)
        if (typeof el?.setViewportSize === 'function') {
            setTimeout(
                () =>
                    el.setViewportSize(el.clientWidth - 5, el.clientHeight - 5),
                10
            )
        }
    }, [availableHeight, availableWidth, isFullscreen, gridWidth])

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
