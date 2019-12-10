import React from 'react';
import PropTypes from 'prop-types';
import i18n from '@dhis2/d2-i18n';
import { colors } from '@dhis2/ui-core';
import { withStyles } from '@material-ui/core/styles';

export const SHOWMORE_BAR_HEIGHT = 16;

const styles = {
    showMore: {
        color: colors.grey700,
        cursor: 'pointer',
        fontSize: 11,
        paddingTop: 5,
        '&:hover': {
            textDecoration: 'underline',
        },
    },
    disabled: {
        paddingTop: 5,
        color: colors.grey500,
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

ShowMoreButton.propTypes = {
    classes: PropTypes.object,
    disabled: PropTypes.bool,
    isMaxHeight: PropTypes.bool,
    onClick: PropTypes.func,
};

export default withStyles(styles)(ShowMoreButton);
