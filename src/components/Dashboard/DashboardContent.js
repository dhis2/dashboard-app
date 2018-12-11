import React, { Fragment } from 'react';
import TitleBar from '../TitleBar/TitleBar';
import ItemGrid from '../ItemGrid/ItemGrid';

export const DashboardContent = props => (
    <Fragment>
        <TitleBar edit={props.editMode} />
        <ItemGrid edit={props.editMode} />
    </Fragment>
);

export default DashboardContent;
