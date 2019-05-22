import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { colors } from '@dhis2/ui-core';
import { withStyles } from '@material-ui/core/styles';

export const SHOWMORE_BAR_HEIGHT = 16;

const styles = {
    showMore: {
        color: colors.grey700,
        cursor: 'pointer',
        fontSize: 11,
        fontWeight: 400,
        height: SHOWMORE_BAR_HEIGHT,
        paddingTop: 5,
        visibility: 'visible',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
    disabled: {
        paddingTop: 5,
        color: colors.grey700,
        fontSize: 11,
        cursor: 'not-allowed',
    },
};

export const ShowMoreButton = ({ onClick, isMaxHeight, classes, disabled }) => {
    return (
        <div style={{ textAlign: 'center' }}>
            {disabled ? (
                <div className={classes.disabled}>{i18n.t('Show more')}</div>
            ) : (
                <div className={classes.showMore} onClick={onClick}>
                    {isMaxHeight ? i18n.t('Show less') : i18n.t('Show more')}
                </div>
            )}
        </div>
    );
};

export default withStyles(styles)(ShowMoreButton);
