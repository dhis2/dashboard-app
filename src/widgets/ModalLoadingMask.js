import React from 'react';
import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';

const styles = {
    modal: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 999999998,
        pointerEvents: 'none',
    },
    dark: {
        backgroundColor: '#000000',
        opacity: 0.2,
        zIndex: 999999999,
    },
};

const ModalLoadingMask = ({ isLoading }) => {
    if (!isLoading) {
        return null;
    }

    return (
        <div className="loading-mask-wrapper">
            <div style={styles.modal}>
                <LoadingMask />
            </div>
            <div
                style={{
                    ...styles.modal,
                    ...styles.dark,
                }}
            />
        </div>
    );
};

export default ModalLoadingMask;
