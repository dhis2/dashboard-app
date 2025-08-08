import sortBy from 'lodash/sortBy.js'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acExitSlideshow } from '../../../actions/slideshow.js'
import { itemTypeSupportsFullscreen } from '../../../modules/itemTypes.js'
import { sGetSlideshow } from '../../../reducers/slideshow.js'

const useSlideshow = (displayItems, slideshowElementRef) => {
    const dispatch = useDispatch()
    const { firstItemIndex } = useSelector(sGetSlideshow)
    const [itemIndex, setItemIndex] = useState(null)
    const [isEnteringSlideshow, setIsEnteringSlideshow] = useState(false)

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
        // Why using the resize event? To avoid the content being
        // resized twice. By waiting to setItemIndex until the resize
        // is complete, then the new height has been set.
        const handleResize = () => {
            if (Number.isInteger(firstItemIndex)) {
                setItemIndex(firstItemIndex)
                setIsEnteringSlideshow(false)
            }
        }
        if (Number.isInteger(firstItemIndex)) {
            window.addEventListener('resize', handleResize)
            setIsEnteringSlideshow(true)

            //triggers window resize event
            slideshowElementRef?.current?.requestFullscreen()
        } else {
            setItemIndex(null)
        }

        return () => {
            window.removeEventListener('resize', handleResize)
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
                    document.dir === 'ltr' ? nextItem() : prevItem()
                } else if (event.key === 'ArrowLeft') {
                    document.dir === 'ltr' ? prevItem() : nextItem()
                }
            }
        }

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                // Exited fullscreen
                dispatch(acExitSlideshow())
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
        isEnteringSlideshow,
    }
}

export default useSlideshow
