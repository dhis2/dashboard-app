import React from 'react'
import { connect } from 'react-redux'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'

import Input from '@material-ui/core/Input'
import {
    Parser as RichTextParser,
    Editor as RichTextEditor,
} from '@dhis2/d2-ui-rich-text'

import { acUpdateDashboardItem } from '../../../actions/editDashboard'
import { sGetEditDashboardItems } from '../../../reducers/editDashboard'
import { sGetSelectedDashboardMode } from '../../../reducers/selected'
import { sGetDashboardItems } from '../../../reducers/dashboards'
import ItemHeader from '../ItemHeader/ItemHeader'
import Line from '../../../widgets/Line'
import { isEditMode, isViewMode } from '../../Dashboard/dashboardModes'

const style = {
    textDiv: {
        padding: '10px',
        whiteSpace: 'pre-line',
        lineHeight: '20px',
    },
    textField: {
        fontSize: '14px',
        fontStretch: 'normal',
        width: '90%',
        margin: '0 auto',
        display: 'block',
        lineHeight: '24px',
    },
    container: {
        marginBottom: '20px',
        marginTop: '20px',
    },
}

const TextItem = props => {
    const { item, dashboardMode, text, acUpdateDashboardItem } = props

    const onChangeText = event => {
        const updatedItem = {
            ...item,
            text: event.target.value,
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
                <ItemHeader title={i18n.t('Text item')} itemId={item.id} />
                <Line />
                <div className="dashboard-item-content">
                    <RichTextEditor onEdit={onChangeText}>
                        <Input
                            value={text}
                            multiline
                            fullWidth
                            style={style.textField}
                            placeholder={i18n.t('Add text here')}
                            onChange={onChangeText}
                        />
                    </RichTextEditor>
                </div>
            </>
        )
    }

    return <>{isEditMode(dashboardMode) ? editItem() : viewItem()}</>
}

const mapStateToProps = (state, ownProps) => {
    const dashboardMode = sGetSelectedDashboardMode(state)
    const items = !isViewMode(dashboardMode)
        ? sGetEditDashboardItems(state)
        : sGetDashboardItems(state)

    const item = items.find(item => item.id === ownProps.item.id)

    return {
        dashboardMode,
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
