import PropTypes from 'prop-types'
import React, { useState } from 'react'
import classes from './styles/DragHandle.module.css'

const DragHandle = ({ onHeightChanged, setDragging }) => {
    const [startingY, setStartingY] = useState(0)

    const onStartDrag = (e) => {
        setStartingY(e.clientY)
        setDragging(true)
        window.addEventListener('mousemove', onDrag)
        window.addEventListener('mouseup', onEndDrag)
    }

    const onDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()

        const currentY = e.clientY

        if (currentY !== startingY && currentY > 0) {
            requestAnimationFrame(() => {
                onHeightChanged(currentY)
            })
        }
    }

    const onEndDrag = () => {
        setDragging(false)
        window.removeEventListener('mousemove', onDrag)
        window.removeEventListener('mouseup', onEndDrag)
    }

    return (
        <div
            className={classes.draghandle}
            onMouseDown={onStartDrag}
            data-test="controlbar-drag-handle"
        />
    )
}

DragHandle.propTypes = {
    setDragging: PropTypes.func,
    onHeightChanged: PropTypes.func,
}

export default React.memo(DragHandle, () => true)
