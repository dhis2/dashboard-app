import i18n from '@dhis2/d2-i18n'
import { Input } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { acSetDashboardTitle } from '../../actions/editDashboard.js'
import { orObject } from '../../modules/util.js'
import { sGetEditDashboardRoot } from '../../reducers/editDashboard.js'

// Dashboard title in the top bar, using the standard DHIS2 UI input.
const InlineTitleEditor = ({ name = '', onChangeTitle }) => (
    <Input
        name="Dashboard title input"
        type="text"
        dense
        value={name}
        placeholder={i18n.t('Untitled dashboard')}
        onChange={({ value }) => onChangeTitle(value)}
        dataTest="dashboard-title-input"
    />
)

InlineTitleEditor.propTypes = {
    name: PropTypes.string,
    onChangeTitle: PropTypes.func,
}

const mapStateToProps = (state) => ({
    name: orObject(sGetEditDashboardRoot(state)).name,
})

export default connect(mapStateToProps, {
    onChangeTitle: acSetDashboardTitle,
})(InlineTitleEditor)
