import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import HeaderMenuItem from './HeaderMenuItem';
import ContentMenuItem from './ContentMenuItem';
import { acAddDashboardItem } from '../../actions/editDashboard';

export const SinglesMenuGroup = ({ acAddDashboardItem, category }) => {
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

SinglesMenuGroup.propTypes = {
    acAddDashboardItem: PropTypes.func,
    category: PropTypes.object,
};

export default connect(
    null,
    { acAddDashboardItem }
)(SinglesMenuGroup);
