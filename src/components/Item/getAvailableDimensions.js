import { isEditMode, isPrintMode } from '../../modules/dashboardModes.js'
import { getItemHeightPx } from '../../modules/gridUtil.js'
import { isElementFullscreen } from './fullscreenUtil.js'
import { getGridItemElement } from './getGridItemElement.js'
import memoizeOne from './memoizeOne.js'

export const getAvailableDimensions = ({
    item,
    headerRef,
    contentRef,
    dashboardMode,
    windowDimensions,
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
        if (isElementFullscreen(item.id)) {
            return (
                height -
                headerRef.current.clientHeight -
                itemHeaderTotalMargin -
                itemContentPadding
            )
        }

        const calculatedHeight =
            getItemHeightPx(item, width) -
            headerRef.current.clientHeight -
            itemHeaderTotalMargin -
            itemContentPadding

        return memoizedGetContentHeight(
            calculatedHeight,
            contentRef.current ? contentRef.current.offsetHeight : null,
            isEditMode(dashboardMode) || isPrintMode(dashboardMode)
        )
    }

    const getAvailableWidth = () => {
        const rect = getGridItemElement(item.id)?.getBoundingClientRect()

        return rect && rect.width - itemContentPadding * 2
    }

    const res = {
        height: getAvailableHeight(windowDimensions),
        width: getAvailableWidth() || undefined,
    }

    return res
}
