import React from 'react';

export const NoContentMessage = ({ text, children }) => (
    <div
        style={{
            padding: '50px 10px',
            textAlign: 'center',
            fontSize: '15px',
            fontWeight: 500,
            color: '#777',
        }}
    >
        {text}
        {children}
    </div>
);

export default NoContentMessage;
