import { DIMENSION_ID_ORGUNIT, DIMENSION_ID_PERIOD } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    IconCross16,
    InputField,
    MultiSelectField,
    MultiSelectOption,
    Radio,
    TextAreaField,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    acSetDashboardCode,
    acSetDashboardDescription,
    acSetFilterSettings,
} from '../../actions/editDashboard.js'
import useDimensions from '../../modules/useDimensions.js'
import {
    sGetEditDashboardCode,
    sGetEditDashboardDescription,
    sGetEditDashboardRoot,
} from '../../reducers/editDashboard.js'
import classes from './styles/SettingsDrawer.module.css'

const PINNED = [DIMENSION_ID_PERIOD, DIMENSION_ID_ORGUNIT]

// Period and org unit always come first, as in the filter settings dialog
const withPinnedFirst = (ids) => [
    ...PINNED.filter((id) => ids.includes(id)),
    ...ids.filter((id) => !PINNED.includes(id)),
]

// Same choices as FilterSettingsDialog, edited in place with a multi-select
const FilterFields = () => {
    const dispatch = useDispatch()
    const { restrictFilters, allowedFilters = [] } = useSelector(
        sGetEditDashboardRoot
    )
    const dimensions = useDimensions(true)
    const set = (restrict, selected) =>
        dispatch(
            acSetFilterSettings({
                restrictFilters: restrict,
                allowedFilters: restrict ? withPinnedFirst(selected) : [],
            })
        )

    return (
        <>
            <Radio
                dense
                name="filter-restriction"
                label={i18n.t('Allow filtering by all dimensions')}
                checked={!restrictFilters}
                onChange={() => set(false, [])}
            />
            <Radio
                dense
                name="filter-restriction"
                label={i18n.t('Only allow filtering by selected dimensions')}
                checked={Boolean(restrictFilters)}
                onChange={() => set(true, [...PINNED, ...allowedFilters])}
            />
            {restrictFilters && (
                <MultiSelectField
                    filterable
                    clearable
                    dense
                    label={i18n.t('Selected filters')}
                    placeholder={i18n.t('Choose dimensions')}
                    loading={!dimensions.length}
                    // options load async; selected values need their options
                    selected={dimensions.length ? allowedFilters : []}
                    onChange={({ selected }) => set(true, selected)}
                >
                    {dimensions.map((d) => (
                        <MultiSelectOption
                            key={d.id}
                            label={d.name}
                            value={d.id}
                        />
                    ))}
                </MultiSelectField>
            )}
        </>
    )
}

// Details, filters, translations and delete — shared by the settings drawer
// (One toolbar) and the Settings tab of the Build sidebar.
export const SettingsFields = ({
    hasId,
    canDelete,
    onTranslate,
    onDelete,
}) => {
    const dispatch = useDispatch()
    const description = useSelector(sGetEditDashboardDescription) || ''
    const code = useSelector(sGetEditDashboardCode) || ''

    return (
        <>
            <section className={classes.section}>
                <TextAreaField
                    label={i18n.t('Description')}
                    value={description}
                    rows={4}
                    onChange={({ value }) =>
                        dispatch(acSetDashboardDescription(value))
                    }
                />
                <InputField
                    label={i18n.t('Code')}
                    value={code}
                    error={code.length > 50}
                    validationText={
                        code.length > 50
                            ? i18n.t("Code can't be longer than 50 characters")
                            : undefined
                    }
                    onChange={({ value }) =>
                        dispatch(acSetDashboardCode(value))
                    }
                />
            </section>
            <section className={classes.section}>
                <h3>{i18n.t('Filters')}</h3>
                <FilterFields />
            </section>
            <section className={classes.section}>
                <h3>{i18n.t('Translations')}</h3>
                {hasId ? (
                    <>
                        <p>
                            {i18n.t(
                                'Translate the title and description into other languages.'
                            )}
                        </p>
                        <Button small secondary onClick={onTranslate}>
                            {i18n.t('Translate')}
                        </Button>
                    </>
                ) : (
                    <p>
                        {i18n.t(
                            'Save the dashboard before adding translations.'
                        )}
                    </p>
                )}
            </section>
            {canDelete && (
                <section className={classes.section}>
                    <h3>{i18n.t('Delete dashboard')}</h3>
                    <p>
                        {i18n.t(
                            'Removes the dashboard for everyone. This can’t be undone.'
                        )}
                    </p>
                    <Button small destructive secondary onClick={onDelete}>
                        {i18n.t('Delete dashboard')}
                    </Button>
                </section>
            )}
        </>
    )
}

SettingsFields.propTypes = {
    onDelete: PropTypes.func.isRequired,
    onTranslate: PropTypes.func.isRequired,
    canDelete: PropTypes.bool,
    hasId: PropTypes.bool,
}

// One drawer for "how the dashboard behaves". Details and filters edit inline;
// translations keep their existing dialog, opened from here.
const SettingsDrawer = ({
    top,
    hasId,
    canDelete,
    onClose,
    onTranslate,
    onDelete,
}) => {
    useEffect(() => {
        const onKeyDown = (e) => e.key === 'Escape' && onClose()
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [onClose])

    return (
        <aside
            className={classes.drawer}
            style={{ insetBlockStart: top }}
            aria-label={i18n.t('Dashboard settings')}
            data-test="settings-drawer"
        >
            <div className={classes.header}>
                <h2>{i18n.t('Dashboard settings')}</h2>
                <Button
                    small
                    secondary
                    icon={<IconCross16 />}
                    onClick={onClose}
                    aria-label={i18n.t('Close')}
                />
            </div>
            <div className={classes.body}>
                <SettingsFields
                    hasId={hasId}
                    canDelete={canDelete}
                    onTranslate={onTranslate}
                    onDelete={onDelete}
                />
            </div>
        </aside>
    )
}

SettingsDrawer.propTypes = {
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onTranslate: PropTypes.func.isRequired,
    canDelete: PropTypes.bool,
    hasId: PropTypes.bool,
    top: PropTypes.number,
}

export default SettingsDrawer
