import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { InputField, TextAreaField } from '@dhis2/ui-core';

import ItemSelector from '../ItemSelector/ItemSelector';
import {
    acSetDashboardTitle,
    acSetDashboardDescription,
} from '../../actions/editDashboard';
import { orObject } from '../../modules/util';
import { sGetEditDashboardRoot } from '../../reducers/editDashboard';

const styles = {
    section: { display: 'flex', justifyContent: 'space-between' },
    titleDescription: {
        flex: '3',
        marginRight: '50px',
    },
    title: {
        display: 'block',
        clear: 'both',
    },
    description: {
        display: 'block',
        clear: 'both',
        marginTop: '15px',
    },
    underline: {
        '&::before': {
            borderBottom: `none`,
        },
        '&:hover::before': {
            borderBottom: `none!important`,
        },
    },
    input: {
        backgroundColor: 'rgba(0, 0, 10, 0.05)',
        borderRadius: '4px',
        width: '100%',
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 10, 0.08)',
        },
    },
    itemSelector: {
        flex: '2',
        position: 'relative',
    },
};

export const EditTitleBar = ({
    name,
    description,
    onChangeTitle,
    onChangeDescription,
    classes,
}) => {
    const updateTitle = (_, e) => {
        onChangeTitle(e.target.value);
    };

    const updateDescription = (_, e) => {
        onChangeDescription(e.target.value);
    };

    return (
        <section className={classes.section}>
            <div className={classes.titleDescription}>
                <InputField
                    className={classes.title}
                    name="Dashboard title input"
                    label={i18n.t('Dashboard title')}
                    type="text"
                    onChange={updateTitle}
                    value={name}
                />
                <TextAreaField
                    className={classes.description}
                    name="Dashboard description input"
                    label={i18n.t('Dashboard description')}
                    onChange={updateDescription}
                    value={description}
                />
            </div>
            <div className={classes.itemSelector}>
                <ItemSelector />
            </div>
        </section>
    );
};

const mapStateToProps = state => {
    const selectedDashboard = orObject(sGetEditDashboardRoot(state));

    return {
        name: selectedDashboard.name,
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
    description: PropTypes.string,
    onChangeTitle: PropTypes.func.isRequired,
    onChangeDescription: PropTypes.func.isRequired,
};

EditTitleBar.defaultProps = {
    name: '',
    description: '',
};
