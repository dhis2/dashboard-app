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
        alignItems: 'flex-start',
    },
    title: {
        position: 'relative',
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

const TitleBar = ({ id, name, displayName, description, edit }) => {
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
                    displayName={displayName}
                    description={description}
                />
            ) : (
                <ViewTitleBar
                    style={style}
                    id={id}
                    name={displayName || name}
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
    const dashboard = orObject(
        fromReducers.fromDashboards.sGetById(state, selectedDashboard.id)
    );

    return {
        id: selectedDashboard.id,
        name: selectedDashboard.name,
        displayName: dashboard && dashboard.displayName,
        description: selectedDashboard.description,
        edit: fromReducers.fromEditDashboard.sGetIsEditing(state),
    };
};

const TitleBarCt = connect(mapStateToProps)(TitleBar);

export default TitleBarCt;
