import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { InputField, TextAreaField, Radio } from '@dhis2/ui'

import ItemSelector from './ItemSelector/ItemSelector'
import {
    acSetDashboardTitle,
    acSetDashboardDescription,
    acSetAddItemsTo,
} from '../../actions/editDashboard'
import { orObject } from '../../modules/util'
import { sGetEditDashboardRoot } from '../../reducers/editDashboard'

import classes from './styles/TitleBar.module.css'

const EditTitleBar = ({
    addItemsTo,
    name,
    description,
    onChangeAddItemsTo,
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
            <div className={classes.row}>
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
            <div className={classes.fieldset}>
                <div className={classes.itemSelector}>
                    <ItemSelector />
                </div>
                <div className={classes.layout}>Layout</div>
                <div className={classes.addItemsTo}>
                    <div>Add items to</div>
                    <div className={classes.radioGroup}>
                        <Radio
                            dense
                            label="End of dashboard"
                            name="END"
                            onChange={value =>
                                value.checked && onChangeAddItemsTo(value.name)
                            }
                            checked={addItemsTo === 'END'}
                        />
                        <Radio
                            dense
                            label="Start of dashboard"
                            name="START"
                            onChange={value =>
                                value.checked && onChangeAddItemsTo(value.name)
                            }
                            checked={addItemsTo === 'START'}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

EditTitleBar.propTypes = {
    onChangeAddItemsTo: PropTypes.func.isRequired,
    onChangeDescription: PropTypes.func.isRequired,
    onChangeTitle: PropTypes.func.isRequired,
    addItemsTo: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string,
}

EditTitleBar.defaultProps = {
    name: '',
    description: '',
    addItemsTo: 'END',
}

const mapStateToProps = state => {
    const selectedDashboard = orObject(sGetEditDashboardRoot(state))

    return {
        name: selectedDashboard.name,
        description: selectedDashboard.description,
        addItemsTo: selectedDashboard.addItemsTo,
    }
}

const mapDispatchToProps = {
    onChangeTitle: acSetDashboardTitle,
    onChangeDescription: acSetDashboardDescription,
    onChangeAddItemsTo: acSetAddItemsTo,
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTitleBar)
