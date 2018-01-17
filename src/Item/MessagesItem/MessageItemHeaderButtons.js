import React, { Fragment } from 'react';

import { colors } from '../../colors';

const style = {
    button: {
        background: 'none !important',
        border: 'none',
        color: colors.darkGrey,
        cursor: 'pointer',
        font: 'inherit',
        fontSize: '12px',
        height: '14px',
        lineJeight: '14px',
        marginRight: '10px',
        padding: '0 !important',
        textDecoration: 'underline',
    },
};

const MessageItemHeaderButtons = props => {
    const { filterAll, filterUnread } = props;
    return (
        <Fragment>
            <button type="button" style={style.button} onClick={filterAll}>
                All
            </button>
            <button type="button" style={style.button} onClick={filterUnread}>
                Unread
            </button>
        </Fragment>
    );
};

export default MessageItemHeaderButtons;
