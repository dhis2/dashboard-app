import React, { Fragment } from 'react';
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

export default DashboardContent;
