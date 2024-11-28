import sortBy from 'lodash/sortBy.js'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetSlideshow } from '../actions/slideshow.js'
import { sGetSlideshow } from '../reducers/slideshow.js'
import { itemTypeSupportsFullscreen } from './itemTypes.js'

const useFullscreen = (displayItems) => {
    const dispatch = useDispatch()
    const sortedItems = useRef([])
    const fsItemStartingIndex = useSelector(sGetSlideshow)
    const [fsItemIndex, setFsItemIndex] = useState(null)
    const [isPreFullscreen, setIsPreFullscreen] = useState(false)
    const fsElementRef = useRef(null)

    // Sort items into order on dashboard
    // and filter out items that don't support fullscreen
    useEffect(() => {
        const sItems = sortBy(displayItems, ['y', 'x']).filter((i) =>
            itemTypeSupportsFullscreen(i.type)
        )
        sortedItems.current = sItems
    }, [displayItems])

    // Slideshow button or Item "View fullscreen" menu clicked
    // Fullscreen Exit button or ESC key pressed
    useEffect(() => {
        if (Number.isInteger(fsItemStartingIndex)) {
            const el = fsElementRef?.current
            setIsPreFullscreen(true)
            el?.requestFullscreen({ navigationUI: 'show' })
            setTimeout(() => {
                setFsItemIndex(fsItemStartingIndex)
                setIsPreFullscreen(false)
            }, 200)
        } else {
            setFsItemIndex(null)
        }
    }, [fsItemStartingIndex])

    // Exit button clicked
    const exitFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen()
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

    // Handle keyboard navigation for the slideshow
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
                dispatch(acSetSlideshow(null))
            }
        }

        // Attach the event listener to the window object
        window.addEventListener('keydown', handleKeyDown)
        document.addEventListener('fullscreenchange', handleFullscreenChange)

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
        isFullscreenView: fsItemIndex !== null,
        isPreFullscreen,
    }
}

export default useFullscreen
