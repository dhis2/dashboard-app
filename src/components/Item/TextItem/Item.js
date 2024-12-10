import { RichTextParser, RichTextEditor } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { Divider, spacers } from '@dhis2/ui'
import cx from 'classnames'
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
import ItemHeader from '../ItemHeader/ItemHeader.js'
import PrintItemInfo from '../ItemHeader/PrintItemInfo.js'
import styles from './styles/TextItem.module.css'

const fullscreenStyle = {
    padding: '24px',
    fontSize: '18px',
    fontStretch: 'normal',
    margin: '0 auto',
    display: 'block',
    lineHeight: '23px',
}

const viewStyle = {
    padding: '10px',
    fontSize: '14px',
    fontStretch: 'normal',
    margin: '0 auto',
    display: 'block',
    lineHeight: '16px',
}

const TextItem = (props) => {
    const { item, dashboardMode, text, isFullscreen, acUpdateDashboardItem } =
        props

    const onChangeText = (text) => {
        const updatedItem = {
            ...item,
            text,
        }

        acUpdateDashboardItem(updatedItem)
    }

    const viewItem = () => {
        return (
            <div
                className={cx(styles.content, {
                    [styles.fullscreen]: isFullscreen,
                })}
            >
                <RichTextParser
                    style={isFullscreen ? fullscreenStyle : viewStyle}
                >
                    {text}
                </RichTextParser>
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
                <div className={cx(styles.content, styles.edit)}>
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
        return (
            <>
                {props.item.shortened ? <PrintItemInfo /> : null}
                <div className={styles.content}>
                    <RichTextParser style={viewStyle}>{text}</RichTextParser>
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
    isFullscreen: PropTypes.bool,
    item: PropTypes.object,
    text: PropTypes.string,
}

export default connect(mapStateToProps, {
    acUpdateDashboardItem,
})(TextItem)
