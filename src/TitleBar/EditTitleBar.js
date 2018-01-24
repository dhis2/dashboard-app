import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ItemSelect from '../ItemSelect/ItemSelect';
import D2ContentEditable from '../widgets/D2ContentEditable';
import { fromEditDashboard } from '../actions';

const EditTitleBar = ({
    name,
    description,
    style,
    onChangeTitle,
    onChangeDescription,
}) => {
    const titleBarEdit = Object.assign({}, style.titleBar, {
        justifyContent: 'space-between',
    });

    return (
        <Fragment>
            <span>Currently editing</span>
            <div style={titleBarEdit}>
                <div style={style.title}>
                    <D2ContentEditable
                        className="dashboard-title editable-text"
                        text={name}
                        disabled={false}
                        placeholder={'Add title here'}
                        onChange={onChangeTitle}
                    />
                </div>
                <ItemSelect />
            </div>
            <div style={style.description}>
                <D2ContentEditable
                    className="dashboard-description editable-text"
                    text={description}
                    disabled={false}
                    placeholder={'Add description here'}
                    onChange={onChangeDescription}
                />
            </div>
        </Fragment>
    );
};

const mapDispatchToProps = dispatch => {
    return {
        onChangeTitle: e =>
            dispatch(fromEditDashboard.acSetDashboardTitle(e.target.value)),
        onChangeDescription: e =>
            dispatch(
                fromEditDashboard.acSetDashboardDescription(e.target.value)
            ),
    };
};

const TitleBarCt = connect(null, mapDispatchToProps)(EditTitleBar);

export default TitleBarCt;

EditTitleBar.propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
};

EditTitleBar.defaultProps = {
    name: '',
    description: '',
};
