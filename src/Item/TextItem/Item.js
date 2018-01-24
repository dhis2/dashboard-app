import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import TextField from 'd2-ui/lib/text-field/TextField';
import { acUpdateDashboardItem } from '../../actions/editDashboard';
import { sGetEditDashboard } from '../../reducers/editDashboard';

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
                        placeholder={'Add text here'}
                        onChange={onChangeText}
                    />
                ) : (
                    text
                )}
            </div>
        </Fragment>
    );
};

export default connect(
    (state, ownProps) => ({
        text:
            sGetEditDashboard(state).dashboardItems.find(
                item => item.id === ownProps.item.id
            ).text || '',
    }),
    {
        acUpdateDashboardItem,
    }
)(TextItem);
