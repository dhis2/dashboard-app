import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import TextField from 'd2-ui/lib/text-field/TextField';
import { acUpdateDashboardItem } from '../../actions/editDashboard';
import { sGetSelectedDashboard } from '../../reducers';

const style = {
    text: {
        fontSize: '13px',
        lineHeight: '17px',
        whiteSpace: 'pre-line',
    },
    textField: {
        width: '80%',
        display: 'inline-block',
        fontSize: '14px',
        fontStretch: 'normal',
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

    return (
        <Fragment>
            <div className="dashboard-item-content">
                {editMode ? (
                    <TextField
                        value={text}
                        multiline
                        rows={1}
                        rowsMax={6}
                        fullWidth
                        style={style.textField}
                        placeholder={'Add text here'}
                        onChange={onChangeText}
                    />
                ) : (
                    <div style={style.text}>{text}</div>
                )}
            </div>
        </Fragment>
    );
};

export default connect(
    (state, ownProps) => ({
        text:
            sGetSelectedDashboard(state).dashboardItems.find(
                item => item.id === ownProps.item.id
            ).text || '',
    }),
    {
        acUpdateDashboardItem,
    }
)(TextItem);
