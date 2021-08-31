import debounce from 'lodash/debounce'
import PropTypes from 'prop-types'
import React, { createContext, useContext, useState, useEffect } from 'react'

export const WindowDimensionsCtx = createContext(null)

const windowDims = () => ({
    height: window.innerHeight,
    width: window.innerWidth,
})

const WindowDimensionsProvider = ({ children }) => {
    const [dimensions, setDimensions] = useState(windowDims())

    useEffect(() => {
        const handleResize = debounce(() => {
            setDimensions(windowDims())
        }, 100)
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <WindowDimensionsCtx.Provider value={dimensions}>
            {children}
        </WindowDimensionsCtx.Provider>
    )
}

WindowDimensionsProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export default WindowDimensionsProvider

export const useWindowDimensions = () => {
    return useContext(WindowDimensionsCtx)
}
