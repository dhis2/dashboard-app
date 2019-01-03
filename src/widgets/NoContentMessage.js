import React from 'react';
import { colors } from '../modules/colors';

export const NoContentMessage = ({ text }) => (
    <div
        style={{
            padding: '50px 10px',
            textAlign: 'center',
            fontSize: '15px',
            fontWeight: 500,
            color: colors.charcoalGrey,
        }}
    >
        {text}
    </div>
);

export default NoContentMessage;
