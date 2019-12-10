import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import TitleBar from '../TitleBar/TitleBar';
import ItemGrid from '../ItemGrid/ItemGrid';
import FilterBar from '../FilterBar/FilterBar';

export const DashboardContent = props => (
    <Fragment>
        <TitleBar edit={props.editMode} />
        <FilterBar />
        <ItemGrid edit={props.editMode} />
    </Fragment>
);

DashboardContent.propTypes = {
    editMode: PropTypes.bool,
};

export default DashboardContent;
