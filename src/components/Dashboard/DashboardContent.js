import React from 'react';
import PropTypes from 'prop-types';
import TitleBar from '../TitleBar/TitleBar';
import ItemGrid from '../ItemGrid/ItemGrid';
import FilterBar from '../FilterBar/FilterBar';
import { PRINT, EDIT, NEW } from './dashboardModes';

export const DashboardContent = props => {
    if (props.mode === EDIT || props.mode === NEW) {
        return (
            <>
                <TitleBar edit={true} />
                <ItemGrid edit={true} />
            </>
        );
    }
    if (props.mode === PRINT) {
        return (
            <>
                <TitleBar edit={true} print={true} />
                <ItemGrid edit={true} print={true} />
            </>
        );
    }
    return (
        <>
            <TitleBar edit={false} />
            <FilterBar />
            <ItemGrid edit={false} />
        </>
    );
};

DashboardContent.propTypes = {
    mode: PropTypes.string,
};

export default DashboardContent;
