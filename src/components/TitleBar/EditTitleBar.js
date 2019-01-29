import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import i18n from 'd2-i18n';
import TextField from 'd2-ui/lib/text-field/TextField';

import {
    acSetDashboardTitle,
    acSetDashboardDescription,
} from '../../actions/editDashboard';
import { orObject } from '../../modules/util';
import { sGetEditDashboardRoot } from '../../reducers/editDashboard';
import { sGetDashboardById } from '../../reducers/dashboards';
import ItemSelect from '../ItemSelect/ItemSelect';

const styles = {
    section: { display: 'flex', justifyContent: 'space-between' },
    titleDescription: {
        flex: '3',
        marginRight: '20px',
    },
    title: { padding: '6px 0' },
    itemSelect: {
        flex: '2',
        minWidth: '300px',
        maxWidth: '730px',
        position: 'relative',
        top: '33px',
    },
};

export const EditTitleBar = ({
    name,
    displayName,
    description,
    style,
    onChangeTitle,
    onChangeDescription,
    classes,
}) => {
    const titleStyle = Object.assign({}, style.title, {
        top: '-2px',
    });

    const translatedName = () => {
        return displayName ? (
            <span style={style.description}>
                {i18n.t('Current translation')}: {displayName}
            </span>
        ) : null;
    };

    return (
        <section className={classes.section}>
            <div className={classes.titleDescription}>
                <span>{i18n.t('Currently editing')}</span>
                <div className={classes.title}>
                    <TextField
                        multiline
                        fullWidth
                        rows={1}
                        rowsMax={3}
                        style={titleStyle}
                        value={name}
                        placeholder={i18n.t('Add title here')}
                        onChange={onChangeTitle}
                    />
                    {translatedName()}
                </div>
                <TextField
                    multiline
                    fullWidth
                    rows={1}
                    rowsMax={3}
                    style={style.description}
                    value={description}
                    placeholder={i18n.t('Add description here')}
                    onChange={onChangeDescription}
                />
            </div>
            <div className={classes.itemSelect}>
                <ItemSelect />
            </div>
        </section>
    );
};

const mapStateToProps = state => {
    const selectedDashboard = orObject(sGetEditDashboardRoot(state));
    const displayName = orObject(sGetDashboardById(state, selectedDashboard.id))
        .displayName;

    return {
        name: selectedDashboard.name,
        displayName,
        description: selectedDashboard.description,
    };
};

const mapDispatchToProps = {
    onChangeTitle: acSetDashboardTitle,
    onChangeDescription: acSetDashboardDescription,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(EditTitleBar));

EditTitleBar.propTypes = {
    name: PropTypes.string,
    displayName: PropTypes.string,
    description: PropTypes.string,
    onChangeTitle: PropTypes.func.isRequired,
    onChangeDescription: PropTypes.func.isRequired,
    style: PropTypes.object,
};

EditTitleBar.defaultProps = {
    name: '',
    displayName: '',
    description: '',
    style: {},
};
