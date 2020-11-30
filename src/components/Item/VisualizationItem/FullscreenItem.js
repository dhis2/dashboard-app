import React from 'react'
import PropTypes from 'prop-types'
import useFullscreenStatus from './useFullscreenStatus'

import classes from './styles/FullscreenItem.module.css'

const FullscreenItem = ({ children }) => {
    const maximizableElement = React.useRef(null)
    let isFullscreen, setIsFullscreen
    // let errorMessage

    try {
        ;[isFullscreen, setIsFullscreen] = useFullscreenStatus(
            maximizableElement
        )
    } catch (e) {
        // errorMessage = 'Fullscreen not supported'
        isFullscreen = false
        setIsFullscreen = undefined
    }

    const handleExitFullscreen = () => document.exitFullscreen()
    const containerClasses = [
        classes.maximizableContainer,
        isFullscreen ? 'fullscreen' : 'default',
    ].join(' ')

    return (
        <div ref={maximizableElement} className={containerClasses}>
            <div className={classes.maximizableContent}>{children}</div>
        </div>
    )
}

FullscreenItem.propTypes = {
    children: PropTypes.node,
}

export default FullscreenItem
