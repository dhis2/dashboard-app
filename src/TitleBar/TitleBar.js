import React from 'react';
import { connect } from 'react-redux';

import EditTitleBar from './EditTitleBar';
import ViewTitleBar from './ViewTitleBar';
import { fromSelected } from '../reducers';
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
    },
    description: {
        paddingTop: 5,
        paddingBottom: 5,
        fontSize: 13,
        color: '#555555',
    },
};

const TitleBar = ({ name, description, edit }) => {
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
        name: selectedDashboard.name,
        description: selectedDashboard.description || 'No description',
        edit: fromSelected.sGetSelectedEdit(state),
    };
};

const TitleBarCt = connect(mapStateToProps, null)(TitleBar);

export default TitleBarCt;
