import { RichTextParser, RichTextEditor } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { Divider, spacers } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { acUpdateDashboardItem } from '../../../actions/editDashboard.js'
import { isEditMode, PRINT_LAYOUT } from '../../../modules/dashboardModes.js'
import { sGetEditDashboardItems } from '../../../reducers/editDashboard.js'
import {
    sGetIsPrinting,
    sGetPrintDashboardItems,
} from '../../../reducers/printDashboard.js'
import { sGetSelectedDashboardItems } from '../../../reducers/selected.js'
import ItemHeader from '../ItemHeader/ItemHeader.jsx'
import PrintItemInfo from '../ItemHeader/PrintItemInfo.jsx'

const style = {
    textDiv: {
        padding: '10px',
        lineHeight: '16px',
    },
    textField: {
        fontSize: '14px',
        fontStretch: 'normal',
        margin: '0 auto',
        display: 'block',
        lineHeight: '24px',
    },
    container: {
        marginBottom: '20px',
        marginTop: '20px',
    },
}

const TextItem = (props) => {
    const { item, dashboardMode, text, acUpdateDashboardItem } = props

    const onChangeText = (text) => {
        const updatedItem = {
            ...item,
            text,
        }

        acUpdateDashboardItem(updatedItem)
    }

    const viewItem = () => {
        const textDivStyle = Object.assign({}, style.textField, style.textDiv)
        return (
            <div className="dashboard-item-content" style={style.container}>
                <RichTextParser style={textDivStyle}>{text}</RichTextParser>
            </div>
        )
    }

    const editItem = () => {
        return (
            <>
                <ItemHeader
                    title={i18n.t('Text box')}
                    itemId={item.id}
                    dashboardMode={dashboardMode}
                />
                <Divider margin={`0 0 ${spacers.dp4} 0`} />
                <div className="dashboard-item-content">
                    <RichTextEditor
                        onChange={onChangeText}
                        inputPlaceholder={i18n.t('Add text here')}
                        value={text}
                        initialFocus={false}
                        resizable={false}
                    />
                </div>
            </>
        )
    }

    const printItem = () => {
        const textDivStyle = Object.assign({}, style.textField, style.textDiv)
        return (
            <>
                {props.item.shortened ? <PrintItemInfo /> : null}
                <div className="dashboard-item-content" style={style.container}>
                    <RichTextParser style={textDivStyle}>{text}</RichTextParser>
                </div>
            </>
        )
    }

    let textItem
    if (isEditMode(dashboardMode)) {
        textItem = editItem
    } else if (dashboardMode === PRINT_LAYOUT) {
        textItem = printItem
    } else {
        textItem = viewItem
    }

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
        items = sGetSelectedDashboardItems(state)
    }

    const item = items.find((item) => item.id === ownProps.item.id)

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
