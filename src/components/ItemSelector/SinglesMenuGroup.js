import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import HeaderMenuItem from './HeaderMenuItem';
import ContentMenuItem from './ContentMenuItem';
import { acAddDashboardItem } from '../../actions/editDashboard';

const SinglesMenuGroup = ({ acAddDashboardItem, category }) => {
    const addToDashboard = ({ type, content }) => () => {
        acAddDashboardItem({ type, content });
    };

    return (
        <Fragment>
            <HeaderMenuItem title={category.header} />
            {category.items.map(item => (
                <ContentMenuItem
                    key={item.type}
                    type={item.type}
                    name={item.name}
                    onInsert={addToDashboard(item)}
                />
            ))}
        </Fragment>
    );
};

export default connect(
    null,
    { acAddDashboardItem }
)(SinglesMenuGroup);
