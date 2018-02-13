import React from 'react';
import { connect } from 'react-redux';

import EditTitleBar from './EditTitleBar';
import ViewTitleBar from './ViewTitleBar';
import * as fromReducers from '../reducers';
import { orObject } from '../util';

import './TitleBar.css';

const style = {
    titleBar: {
        display: 'flex',
        alignItems: 'flex-end',
    },
    title: {
        marginRight: 20,
        position: 'relative',
        top: -2,
        fontSize: 21,
        fontWeight: 500,
        color: '#333333',
        minWidth: 50,
    },
    description: {
        paddingTop: 5,
        paddingBottom: 5,
        fontSize: 13,
        color: '#555555',
    },
};

const TitleBar = ({ id, name, description, edit }) => {
    return (
        <div
            className="titlebar-wrapper"
            style={{
                padding: '20px 15px 5px 10px',
            }}
        >
            {edit ? (
                <EditTitleBar
                    style={style}
                    name={name}
                    description={description}
                />
            ) : (
                <ViewTitleBar
                    style={style}
                    id={id}
                    name={name}
                    description={description}
                />
            )}
        </div>
    );
};

const mapStateToProps = state => {
    const selectedDashboard = orObject(
        fromReducers.sGetSelectedDashboard(state)
    );
    return {
        id: selectedDashboard.id,
        name: selectedDashboard.name,
        description: selectedDashboard.description,
        edit: fromReducers.fromEditDashboard.sGetIsEditing(state),
    };
};

const TitleBarCt = connect(mapStateToProps)(TitleBar);

export default TitleBarCt;
