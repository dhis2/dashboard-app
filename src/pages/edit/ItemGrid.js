import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Responsive as ResponsiveReactGridLayout } from 'react-grid-layout'
import { connect } from 'react-redux'
import { acUpdateDashboardLayout } from '../../actions/editDashboard'
import { Item } from '../../components/Item/Item'
import NoContentMessage from '../../components/NoContentMessage'
import ProgressiveLoadingContainer from '../../components/ProgressiveLoadingContainer'
import { useWindowDimensions } from '../../components/WindowDimensionsProvider'
import { EDIT } from '../../modules/dashboardModes'
import { getGridItemDomElementClassName } from '../../modules/getGridItemDomElementClassName'
import {
    GRID_ROW_HEIGHT_PX,
    GRID_COMPACT_TYPE,
    MARGIN_PX,
    GRID_PADDING_PX,
    GRID_COLUMNS,
    hasShape,
    getGridWidth,
} from '../../modules/gridUtil'
import { getBreakpoint } from '../../modules/smallScreen'
import { orArray } from '../../modules/util'
import { sGetEditDashboardItems } from '../../reducers/editDashboard'
import classes from './styles/ItemGrid.module.css'

const EditItemGrid = ({ dashboardItems, acUpdateDashboardLayout }) => {
    const [gridWidth, setGridWidth] = useState(0)
    const { width } = useWindowDimensions()

    const onLayoutChange = newLayout => acUpdateDashboardLayout(newLayout)

    const onWidthChanged = containerWidth =>
        setTimeout(() => setGridWidth(containerWidth), 200)

    const getItemComponent = item => (
        <ProgressiveLoadingContainer
            key={item.i}
            className={cx(
                item.type,
                'edit',
                getGridItemDomElementClassName(item.id)
            )}
            itemId={item.id}
        >
            <Item item={item} gridWidth={gridWidth} dashboardMode={EDIT} />
        </ProgressiveLoadingContainer>
    )

    const getItemComponents = items => items.map(item => getItemComponent(item))

    if (!dashboardItems.length) {
        return (
            <NoContentMessage
                text={i18n.t('There are no items on this dashboard')}
            />
        )
    }

    return (
        <ResponsiveReactGridLayout
            className={classes.grid}
            rowHeight={GRID_ROW_HEIGHT_PX}
            width={getGridWidth(width)}
            cols={{ lg: GRID_COLUMNS }}
            breakpoints={{
                lg: getBreakpoint(),
            }}
            layouts={{ lg: dashboardItems }}
            compactType={GRID_COMPACT_TYPE}
            margin={MARGIN_PX}
            containerPadding={{ lg: GRID_PADDING_PX }}
            onLayoutChange={onLayoutChange}
            onWidthChange={onWidthChanged}
            isDraggable={true}
            isResizable={true}
            draggableCancel="input,textarea"
        >
            {getItemComponents(dashboardItems)}
        </ResponsiveReactGridLayout>
    )
}

EditItemGrid.propTypes = {
    acUpdateDashboardLayout: PropTypes.func,
    dashboardItems: PropTypes.array,
}

// Container

const mapStateToProps = state => {
    return {
        dashboardItems: orArray(sGetEditDashboardItems(state)).filter(hasShape),
    }
}

const mapDispatchToProps = {
    acUpdateDashboardLayout,
}

export default connect(mapStateToProps, mapDispatchToProps)(EditItemGrid)
