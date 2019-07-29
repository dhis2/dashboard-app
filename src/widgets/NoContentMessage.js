import React from 'react';
import { colors } from '@dhis2/ui-core';

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

export default NoContentMessage;
