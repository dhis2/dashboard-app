import React from 'react';
import i18n from 'd2-i18n';
import { withStyles } from '@material-ui/core/styles';

import { colors } from '../../modules/colors';

export const SHOWMORE_BAR_HEIGHT = 16;

const styles = {
    showMore: {
        color: colors.royalBlue,
        cursor: 'pointer',
        fontSize: 11,
        fontWeight: 700,
        height: SHOWMORE_BAR_HEIGHT,
        paddingTop: 5,
        textTransform: 'uppercase',
        visibility: 'visible',
    },
};

export const ShowMoreButton = ({ onClick, isMaxHeight, classes }) => (
    <div style={{ textAlign: 'center' }}>
        <div className={classes.showMore} onClick={onClick}>
            {isMaxHeight ? i18n.t('Show less') : i18n.t('Show more')}
        </div>
    </div>
);

export default withStyles(styles)(ShowMoreButton);
