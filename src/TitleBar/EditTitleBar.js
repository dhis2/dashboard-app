import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { t } from 'dhis2-i18n';

import ItemSelect from '../ItemSelect/ItemSelect';
import TextField from 'd2-ui/lib/text-field/TextField';
import { fromEditDashboard } from '../actions';

const EditTitleBar = ({
    name,
    displayName,
    description,
    style,
    onChangeTitle,
    onChangeDescription,
}) => {
    const titleStyle = Object.assign({}, style.title, {
        top: '-2px',
    });

    const translatedName = () => {
        return displayName ? (
            <span style={style.description}>
                Current translation: {displayName}
            </span>
        ) : null;
    };

    return (
        <section style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: '1', marginRight: '20px' }}>
                <span>Currently editing</span>
                <div style={{ padding: '6px 0' }}>
                    <TextField
                        multiline
                        fullWidth
                        rows={1}
                        rowsMax={3}
                        style={titleStyle}
                        value={name}
                        placeholder={t('Add title here')}
                        onChange={onChangeTitle}
                    />
                    {translatedName()}
                </div>
                <TextField
                    multiline
                    fullWidth
                    rows={1}
                    rowsMax={3}
                    style={style.description}
                    value={description}
                    placeholder={t('Add description here')}
                    onChange={onChangeDescription}
                />
            </div>
            <div>
                <ItemSelect />
            </div>
        </section>
    );
};

const mapDispatchToProps = dispatch => ({
    onChangeTitle: text =>
        dispatch(fromEditDashboard.acSetDashboardTitle(text)),
    onChangeDescription: text =>
        dispatch(fromEditDashboard.acSetDashboardDescription(text)),
});

const TitleBarCt = connect(null, mapDispatchToProps)(EditTitleBar);

export default TitleBarCt;

EditTitleBar.propTypes = {
    name: PropTypes.string,
    displayName: PropTypes.string,
    description: PropTypes.string,
};

EditTitleBar.defaultProps = {
    name: '',
    displayName: '',
    description: '',
};
