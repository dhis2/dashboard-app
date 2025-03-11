import i18n from '@dhis2/d2-i18n'
import { CheckboxField, InputField, TextAreaField } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import {
    FIELD_NAME_TITLE,
    FIELD_NAME_CODE,
    FIELD_NAME_DESCRIPTION,
    FIELD_NAME_SUPERSET_EMBED_ID,
    FIELD_NAME_EXPAND_FILTERS,
    FIELD_NAME_SHOW_CHART_CONTROLS,
} from '../../../modules/useSupersetDashboardFieldsState.js'
import styles from './styles/SupersetDashboardFields.module.css'

export const SupersetDashboardFields = ({
    values,
    submitting,
    onChange,
    onSupersetEmbedIdFieldBlur,
    shouldShowSupersetEmbedIdError,
}) => {
    return (
        <>
            <InputField
                initialFocus
                label={i18n.t('Title')}
                type="text"
                onChange={onChange}
                value={values.title}
                disabled={submitting}
                name={FIELD_NAME_TITLE}
                className={styles.textField}
            />
            <InputField
                label={i18n.t('Code')}
                type="text"
                helpText={i18n.t(
                    'A unique code to reference this dashboard in other apps and services. Max 50 characters.'
                )}
                onChange={onChange}
                value={values.code}
                disabled={submitting}
                name={FIELD_NAME_CODE}
                className={styles.textField}
            />
            <TextAreaField
                label={i18n.t('Description')}
                type="text"
                onChange={onChange}
                value={values.description}
                disabled={submitting}
                name={FIELD_NAME_DESCRIPTION}
                className={styles.textField}
            />
            <InputField
                label={i18n.t('Superset Embed ID')}
                type="text"
                onChange={onChange}
                onBlur={onSupersetEmbedIdFieldBlur}
                value={values.supersetEmbedId}
                disabled={submitting}
                name={FIELD_NAME_SUPERSET_EMBED_ID}
                error={shouldShowSupersetEmbedIdError}
                validationText={
                    shouldShowSupersetEmbedIdError
                        ? i18n.t('Invalid UUID')
                        : undefined
                }
                required
                className={styles.textField}
            />
            <fieldset className={styles.options}>
                <legend>{i18n.t('Options')}</legend>
                <CheckboxField
                    dense
                    label={i18n.t('Show chart controls on dashboard items')}
                    onChange={onChange}
                    checked={values.showChartControls}
                    disabled={submitting}
                    name={FIELD_NAME_SHOW_CHART_CONTROLS}
                />
                <CheckboxField
                    dense
                    label={i18n.t('Expand filters')}
                    onChange={onChange}
                    checked={values.expandFilters}
                    disabled={submitting}
                    name={FIELD_NAME_EXPAND_FILTERS}
                />
            </fieldset>
        </>
    )
}

SupersetDashboardFields.propTypes = {
    shouldShowSupersetEmbedIdError: PropTypes.bool,
    submitting: PropTypes.bool,
    values: PropTypes.shape({
        code: PropTypes.string,
        description: PropTypes.string,
        expandFilters: PropTypes.bool,
        showChartControls: PropTypes.bool,
        supersetEmbedId: PropTypes.string,
        title: PropTypes.string,
    }),
    onChange: PropTypes.func,
    onSupersetEmbedIdFieldBlur: PropTypes.func,
}
