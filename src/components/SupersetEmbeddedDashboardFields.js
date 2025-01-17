import i18n from '@dhis2/d2-i18n'
import { CheckboxField, InputField, TextAreaField } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { fieldNames } from '../modules/useSupersetEmbeddedDashboardFieldsState.js'
import styles from './styles/SupersetEmbeddedDashboardFields.module.css'

export const SupersetEmbeddedDashboardFields = ({
    values,
    submitting,
    onChange,
    onSupersetEmbedIdFieldBlur,
    isSupersetEmbedIdValid,
    isSupersetEmbedIdFieldTouched,
}) => {
    const supersetEmbedIdFieldHasError =
        isSupersetEmbedIdFieldTouched && !isSupersetEmbedIdValid
    return (
        <>
            <InputField
                label={i18n.t('Title')}
                type="text"
                onChange={onChange}
                value={values.title}
                disabled={submitting}
                name={fieldNames.title}
                className={styles.textField}
            />
            <InputField
                label={i18n.t('Code')}
                type="text"
                onChange={onChange}
                value={values.code}
                disabled={submitting}
                name={fieldNames.code}
                className={styles.textField}
            />
            <TextAreaField
                label={i18n.t('Description')}
                type="text"
                onChange={onChange}
                value={values.description}
                disabled={submitting}
                name={fieldNames.description}
                className={styles.textField}
            />
            <InputField
                label={i18n.t('Superset Embed ID')}
                type="text"
                onChange={onChange}
                onBlur={onSupersetEmbedIdFieldBlur}
                value={values.supersetEmbedId}
                disabled={submitting}
                name={fieldNames.supersetEmbedId}
                error={supersetEmbedIdFieldHasError}
                validationText={
                    supersetEmbedIdFieldHasError
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
                    name={fieldNames.showChartControls}
                />
                <CheckboxField
                    dense
                    label={i18n.t('Show filters')}
                    onChange={onChange}
                    checked={values.showFilters}
                    disabled={submitting}
                    name={fieldNames.showFilters}
                />
            </fieldset>
        </>
    )
}

SupersetEmbeddedDashboardFields.propTypes = {
    isSupersetEmbedIdFieldTouched: PropTypes.bool,
    isSupersetEmbedIdValid: PropTypes.bool,
    submitting: PropTypes.bool,
    values: PropTypes.shape({
        code: PropTypes.string,
        description: PropTypes.string,
        showChartControls: PropTypes.bool,
        showFilters: PropTypes.bool,
        supersetEmbedId: PropTypes.string,
        title: PropTypes.string,
    }),
    onChange: PropTypes.func,
    onSupersetEmbedIdFieldBlur: PropTypes.func,
}
