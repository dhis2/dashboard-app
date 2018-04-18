import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import i18n from 'd2-i18n';

import ItemHeader from '../ItemHeader';
import Line from '../../widgets/Line';
import TextField from 'd2-ui/lib/text-field/TextField';
import { acUpdateDashboardItem } from '../../actions/editDashboard';
import { sGetSelectedDashboard } from '../../reducers';
import { orArray } from '../../util';
import { sGetItems } from '../../reducers/dashboards';

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
    },
    container: {
        marginBottom: '20px',
        marginTop: '20px',
    },
};

const TextItem = props => {
    const { item, editMode, text, acUpdateDashboardItem } = props;

    const onChangeText = text => {
        const updatedItem = {
            ...item,
            text,
        };

        acUpdateDashboardItem(updatedItem);
    };

    const viewItem = () => {
        const textDivStyle = Object.assign({}, style.textField, style.textDiv);
        return (
            <div className="dashboard-item-content" style={style.container}>
                <div style={textDivStyle}>{text}</div>
            </div>
        );
    };

    const editItem = () => {
        return (
            <Fragment>
                <ItemHeader title={i18n.t('Text item')} />
                <Line />
                <div className="dashboard-item-content">
                    <TextField
                        value={text}
                        multiline
                        rows={1}
                        rowsMax={8}
                        fullWidth
                        style={style.textField}
                        placeholder={i18n.t('Add text here')}
                        onChange={onChangeText}
                    />
                </div>
            </Fragment>
        );
    };

    return <Fragment>{editMode ? editItem() : viewItem()}</Fragment>;
};

const mapStateToProps = (state, ownProps) => ({
    text:
        sGetItems(state).find(item => item.id === ownProps.item.id).text || '',
});

export default connect(mapStateToProps, {
    acUpdateDashboardItem,
})(TextItem);
