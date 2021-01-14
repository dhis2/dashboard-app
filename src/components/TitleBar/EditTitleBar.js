import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { InputField, TextAreaField } from '@dhis2/ui'

import ItemSelector from '../ItemSelector/ItemSelector'
import {
    acSetDashboardTitle,
    acSetDashboardDescription,
} from '../../actions/editDashboard'
import { orObject } from '../../modules/util'
import { sGetEditDashboardRoot } from '../../reducers/editDashboard'

import classes from './styles/EditTitleBar.module.css'

export const EditTitleBar = ({
    name,
    description,
    onChangeTitle,
    onChangeDescription,
}) => {
    const updateTitle = (_, e) => {
        onChangeTitle(e.target.value)
    }

    const updateDescription = (_, e) => {
        onChangeDescription(e.target.value)
    }

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
                    placeholder={i18n.t('Untitled dashboard')}
                    dataTest="dashboard-title-input"
                />
                <TextAreaField
                    className={classes.description}
                    name="Dashboard description input"
                    label={i18n.t('Dashboard description')}
                    onChange={updateDescription}
                    value={description}
                    dataTest="dashboard-description-input"
                />
            </div>
            <div className={classes.itemSelector}>
                <ItemSelector />
            </div>
        </section>
    )
}

EditTitleBar.propTypes = {
    onChangeDescription: PropTypes.func.isRequired,
    onChangeTitle: PropTypes.func.isRequired,
    description: PropTypes.string,
    name: PropTypes.string,
}

EditTitleBar.defaultProps = {
    name: '',
    description: '',
}

const mapStateToProps = state => {
    const selectedDashboard = orObject(sGetEditDashboardRoot(state))

    return {
        name: selectedDashboard.name,
        description: selectedDashboard.description,
    }
}

const mapDispatchToProps = {
    onChangeTitle: acSetDashboardTitle,
    onChangeDescription: acSetDashboardDescription,
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTitleBar)
