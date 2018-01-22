import React from 'react';
import { connect } from 'react-redux';

import EditTitleBar from './EditTitleBar';
import ViewTitleBar from './ViewTitleBar';
import { fromSelected } from '../reducers';

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

const TitleBar = ({ edit }) => {
    return (
        <div
            className="titlebar-wrapper"
            style={{
                padding: '20px 15px 5px 10px',
            }}
        >
            {edit ? (
                <EditTitleBar style={style} />
            ) : (
                <ViewTitleBar style={style} />
            )}
        </div>
    );
};

const mapStateToProps = state => ({
    edit: fromSelected.sGetSelectedEdit(state),
});

const TitleBarCt = connect(mapStateToProps, null)(TitleBar);

export default TitleBarCt;
