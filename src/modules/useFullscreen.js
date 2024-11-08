import sortBy from 'lodash/sortBy.js'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetPresentDashboard } from '../actions/presentDashboard.js'
import { sGetPresentDashboard } from '../reducers/presentDashboard.js'
import { SPACER, MESSAGES } from './itemTypes.js'

const useFullscreen = (displayItems) => {
    const dispatch = useDispatch()
    const sortedItems = useRef([])
    const fsItemStartingIndex = useSelector(sGetPresentDashboard)
    const [fsItemIndex, setFsItemIndex] = useState(null)
    const fsElementRef = useRef(null)

    useEffect(() => {
        const sItems = sortBy(displayItems, ['y', 'x']).filter(
            (i) => [SPACER, MESSAGES].indexOf(i.type) === -1
        )
        sortedItems.current = sItems
    }, [displayItems])

    // Handle Present button or Item Fullscreen button clicked
    useEffect(() => {
        if (Number.isInteger(fsItemStartingIndex)) {
            const el = fsElementRef?.current
            el?.requestFullscreen()
            setFsItemIndex(fsItemStartingIndex)
        } else if (document.fullscreenElement) {
            document.exitFullscreen().then(() => {
                setFsItemIndex(null)
            })
        } else {
            setFsItemIndex(null)
        }
    }, [fsItemStartingIndex])

    const exitFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen().then(() => {
                dispatch(acSetPresentDashboard(null))
            })
        }
    }

    const nextItem = useCallback(() => {
        if (fsItemIndex === sortedItems.current.length - 1) {
            setFsItemIndex(0)
        } else {
            setFsItemIndex(fsItemIndex + 1)
        }
    }, [fsItemIndex])

    const prevItem = useCallback(() => {
        if (fsItemIndex === 0) {
            setFsItemIndex(sortedItems.current.length - 1)
        } else {
            setFsItemIndex(fsItemIndex - 1)
        }
    }, [fsItemIndex])

    // This effect handles the keyboard navigation for the fullscreen mode
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (document.fullscreenElement) {
                if (event.key === 'ArrowRight') {
                    nextItem()
                } else if (event.key === 'ArrowLeft') {
                    prevItem()
                }
            }
        }

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                setFsItemIndex(null)
                dispatch(acSetPresentDashboard(null))
            }
        }

        // Attach the event listener to the window object
        window.addEventListener('keydown', handleKeyDown)
        document.addEventListener('fullscreenchange', handleFullscreenChange)

        // Clean up the event listener when the component is unmounted
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener(
                'fullscreenchange',
                handleFullscreenChange
            )
        }
    }, [dispatch, nextItem, prevItem])

    return {
        fsItemIndex,
        fsElementRef,
        exitFullscreen,
        nextItem,
        prevItem,
        sortedItems: sortedItems.current,
    }
}

export default useFullscreen
