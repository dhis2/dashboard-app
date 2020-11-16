import React from 'react'
import { connect } from 'react-redux'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { TextArea } from '@dhis2/ui'
import ItemHeader from '../ItemHeader/ItemHeader'
import Line from '../../../widgets/Line'
import {
    Parser as RichTextParser,
    Editor as RichTextEditor,
} from '@dhis2/d2-ui-rich-text'

import { acUpdateDashboardItem } from '../../../actions/editDashboard'
import { sGetEditDashboardItems } from '../../../reducers/editDashboard'
import { sGetDashboardItems } from '../../../reducers/dashboards'
import {
    sGetIsPrinting,
    sGetPrintDashboardItems,
} from '../../../reducers/printDashboard'
import { isEditMode } from '../../Dashboard/dashboardModes'

import classes from './styles/Item.module.css'

const TextItem = props => {
    const { item, dashboardMode, text, acUpdateDashboardItem } = props

    const onChangeText = event => {
        const updatedItem = {
            ...item,
            text: event.value,
        }

        acUpdateDashboardItem(updatedItem)
    }

    const viewItem = () => (
        <div className={cx(classes.viewContainer, 'dashboard-item-content')}>
            <div className={classes.view}>
                <RichTextParser>{text}</RichTextParser>
            </div>
        </div>
    )

    const editItem = () => (
        <>
            <ItemHeader
                title={i18n.t('Text item')}
                itemId={item.id}
                dashboardMode={dashboardMode}
            />
            <Line />
            <div className="dashboard-item-content">
                <RichTextEditor onEdit={onChangeText}>
                    <TextArea
                        className={classes.edit}
                        value={text}
                        placeholder={i18n.t('Add text here')}
                        onChange={onChangeText}
                    />
                </RichTextEditor>
            </div>
        </>
    )

    const textItem = isEditMode(dashboardMode) ? editItem : viewItem

    return <>{textItem()}</>
}

const mapStateToProps = (state, ownProps) => {
    const isPrintPreview = sGetIsPrinting(state)
    let items
    if (isPrintPreview) {
        items = sGetPrintDashboardItems(state)
    } else if (isEditMode(ownProps.dashboardMode)) {
        items = sGetEditDashboardItems(state)
    } else {
        items = sGetDashboardItems(state)
    }

    const item = items.find(item => item.id === ownProps.item.id)

    return {
        text: item ? item.text : '',
    }
}

TextItem.propTypes = {
    acUpdateDashboardItem: PropTypes.func,
    dashboardMode: PropTypes.string,
    item: PropTypes.object,
    text: PropTypes.string,
}

export default connect(mapStateToProps, {
    acUpdateDashboardItem,
})(TextItem)
