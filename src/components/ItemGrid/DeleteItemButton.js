import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ItemHeaderButton from '../Item/ItemHeaderButton';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = theme => ({
    deleteIcon: {
        fill: theme.palette.status.negative,
    },
});

const containerStyle = {
    position: 'absolute',
    top: '7px',
    right: '7px',
    zIndex: '1000',
};

const DeleteItemHeaderButton = ({ classes, onClick }) => (
    <ItemHeaderButton onClick={onClick} style={containerStyle}>
        <DeleteIcon className={classes.deleteIcon} />
    </ItemHeaderButton>
);

export default withStyles(styles)(DeleteItemHeaderButton);
