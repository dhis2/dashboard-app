import { isEditMode, isPrintMode } from '../../modules/dashboardModes.js'
import { getItemHeightPx } from '../../modules/gridUtil.js'
import { getGridItemElement } from './getGridItemElement.js'
import memoizeOne from './memoizeOne.js'

const MIN_CLIENT_HEIGHT = 16
const FS_CONTROLS_BUFFER = 40 // space for the fullscreen controls at bottom of screen

export const getAvailableDimensions = ({
    item,
    headerRef,
    contentRef,
    dashboardMode,
    windowDimensions,
    isFullscreen,
}) => {
    const style = window.getComputedStyle(document.documentElement)

    const itemContentPadding = parseInt(
        style.getPropertyValue('--item-content-padding').replace('px', '')
    )

    const itemHeaderTotalMargin =
        parseInt(
            style.getPropertyValue('--item-header-margin-top').replace('px', '')
        ) +
        parseInt(
            style
                .getPropertyValue('--item-header-margin-bottom')
                .replace('px', '')
        )

    const memoizedGetContentHeight = memoizeOne(
        (calculatedHeight, measuredHeight, preferMeasured) =>
            preferMeasured
                ? measuredHeight || calculatedHeight
                : calculatedHeight
    )

    const getAvailableHeight = ({ width, height }) => {
        if (isFullscreen) {
            const ht =
                height -
                ((headerRef.current.clientHeight || MIN_CLIENT_HEIGHT) +
                    itemHeaderTotalMargin +
                    (isFullscreen ? 0 : itemContentPadding) +
                    FS_CONTROLS_BUFFER)

            return `${ht}px`
        }

        const calculatedHeight =
            getItemHeightPx(item, width) -
            headerRef.current.clientHeight -
            itemHeaderTotalMargin -
            itemContentPadding

        const memoheight = memoizedGetContentHeight(
            calculatedHeight,
            contentRef.current ? contentRef.current.offsetHeight : null,
            isEditMode(dashboardMode) || isPrintMode(dashboardMode)
        )

        return `${memoheight}px`
    }

    const getAvailableWidth = () => {
        if (isFullscreen) {
            return '100%'
        }
        const rect = getGridItemElement(item.id)?.getBoundingClientRect()

        const width = rect && rect.width - itemContentPadding * 2
        return `${width}px`
    }

    const res = {
        height: getAvailableHeight(windowDimensions),
        width: getAvailableWidth() || undefined,
    }

    return res
}
