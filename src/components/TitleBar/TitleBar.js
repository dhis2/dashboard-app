import React from 'react';

import { colors } from '../../modules/colors';
import EditTitleBar from './EditTitleBar';
import ViewTitleBar from './ViewTitleBar';

import './TitleBar.css';

const style = {
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

export default TitleBar;
