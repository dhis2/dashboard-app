import React from 'react';
import { colors } from '@dhis2/ui-core';
import PropTypes from 'prop-types';

export const NoContentMessage = ({ text }) => (
    <div
        style={{
            padding: '50px 10px',
            textAlign: 'center',
            fontSize: '15px',
            fontWeight: 500,
            color: colors.grey600,
        }}
    >
        {text}
    </div>
);

NoContentMessage.propTypes = {
    text: PropTypes.string,
};

export default NoContentMessage;
