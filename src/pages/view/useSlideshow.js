import sortBy from 'lodash/sortBy.js'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetSlideshow } from '../../actions/slideshow.js'
import { itemTypeSupportsFullscreen } from '../../modules/itemTypes.js'
import { sGetSlideshow } from '../../reducers/slideshow.js'

const useSlideshow = (displayItems, slideshowElementRef) => {
    const dispatch = useDispatch()
    const firstItemIndex = useSelector(sGetSlideshow)
    const [itemIndex, setItemIndex] = useState(null)
    const [isPreSlideshow, setIsPreSlideshow] = useState(false)

    // Sort items into order on dashboard
    // and filter out items that don't support fullscreen
    const sortedItems = useMemo(
        () =>
            sortBy(displayItems, ['y', 'x']).filter((item) =>
                itemTypeSupportsFullscreen(item.type)
            ),
        [displayItems]
    )

    // Slideshow button or Item "View fullscreen" menu clicked
    // Fullscreen Exit button or ESC key pressed
    useEffect(() => {
        if (Number.isInteger(firstItemIndex)) {
            const el = slideshowElementRef?.current
            setIsPreSlideshow(true)
            el?.requestFullscreen({ navigationUI: 'show' })
            setTimeout(() => {
                setItemIndex(firstItemIndex)
                setIsPreSlideshow(false)
            }, 200)
        } else {
            setItemIndex(null)
        }
    }, [firstItemIndex, slideshowElementRef])

    // Exit button clicked
    const exitSlideshow = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen()
        }
    }

    const nextItem = useCallback(() => {
        if (itemIndex === sortedItems.length - 1) {
            setItemIndex(0)
        } else {
            setItemIndex(itemIndex + 1)
        }
    }, [itemIndex, sortedItems])

    const prevItem = useCallback(() => {
        if (itemIndex === 0) {
            setItemIndex(sortedItems.length - 1)
        } else {
            setItemIndex(itemIndex - 1)
        }
    }, [itemIndex, sortedItems])

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
        slideshowItemIndex: itemIndex,
        slideshowElementRef,
        exitSlideshow,
        nextItem,
        prevItem,
        sortedItems,
        isPreSlideshow,
    }
}

export default useSlideshow
