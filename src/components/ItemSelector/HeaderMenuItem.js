import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem, colors } from '@dhis2/ui-core';

const HeaderMenuItem = ({ title }) => (
    <MenuItem
        dense
        key={title}
        disabled
        label={
            <p style={{ color: colors.grey800, fontWeight: '600' }}>{title}</p>
        }
    />
);

HeaderMenuItem.propTypes = {
    title: PropTypes.string.isRequired,
};

export default HeaderMenuItem;
