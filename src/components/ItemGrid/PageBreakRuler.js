import React from 'react';

const PageBreakRuler = () => {
    return (
        <hr
            style={{
                position: 'relative',
                top: `${window.screen.availHeight}px`,
            }}
        />
    );
};

export default PageBreakRuler;
