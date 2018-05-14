import React, { Fragment } from 'react';
import PageContainer from '../PageContainer/PageContainer';
import PageContainerSpacer from '../PageContainer/PageContainerSpacer';
import ControlBarContainer from '../ControlBarContainer/ControlBarContainer';

const Dashboard = props => {
    console.log(props);

    return (
        <Fragment>
            <ControlBarContainer />
            <PageContainerSpacer />
            <PageContainer />
        </Fragment>
    );
};

export default Dashboard;
