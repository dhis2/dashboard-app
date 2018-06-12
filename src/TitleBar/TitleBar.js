import React from 'react';
import { connect } from 'react-redux';

import EditTitleBar from './EditTitleBar';
import ViewTitleBar from './ViewTitleBar';
import * as fromReducers from '../reducers';
import { orObject } from '../util';
import { colors } from '../colors';

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
        color: colors.black,
        minWidth: 50,
    },
    description: {
        fontSize: 14,
        color: colors.darkGrey,
    },
};

const TitleBar = ({
    id,
    name,
    displayName,
    description,
    displayDescription,
    edit,
}) => {
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
                    name={displayName}
                    description={displayDescription}
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
        displayDescription: dashboard && dashboard.displayDescription,
    };
};

const TitleBarCt = connect(mapStateToProps)(TitleBar);

export default TitleBarCt;
