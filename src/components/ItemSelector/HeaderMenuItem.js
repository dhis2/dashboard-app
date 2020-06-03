import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem } from '@dhis2/ui-core';
import { colors } from '@dhis2/ui-constants';

const HeaderMenuItem = ({ title }) => (
    <MenuItem
        dense
        key={title}
        disabled
        label={
            <span style={{ color: colors.grey800, fontWeight: '600' }}>
                {title}
            </span>
        }
        onClick={undefined}
    />
);

HeaderMenuItem.propTypes = {
    title: PropTypes.string.isRequired,
};

export default HeaderMenuItem;
