import React from 'react';
import PropTypes from 'prop-types';

import { colors } from '@dhis2/ui-core';
import EditTitleBar from './EditTitleBar';
import ViewTitleBar from './ViewTitleBar';

import './TitleBar.css';
import PrintTitleBar from './PrintTitleBar';

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
        color: colors.grey800,
    },
};

const getTitleBar = (edit, print) => {
    if (print) {
        return <PrintTitleBar style={style} />;
    }

    if (edit) {
        return <EditTitleBar style={style} />;
    }

    return <ViewTitleBar style={style} />;
};

const TitleBar = ({ edit, print }) => {
    return (
        <div
            className="titlebar-wrapper"
            style={{
                padding: '20px 15px 5px 10px',
            }}
        >
            {getTitleBar(edit, print)}
        </div>
    );
};

TitleBar.propTypes = {
    edit: PropTypes.bool,
    print: PropTypes.bool,
};

export default TitleBar;
