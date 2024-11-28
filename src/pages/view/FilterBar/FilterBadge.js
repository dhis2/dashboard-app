import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { IconCross16, Tooltip } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { acSetActiveModalDimension } from '../../../actions/activeModalDimension.js'
import { useCacheableSection } from '../../../modules/useCacheableSection.js'
import { sGetSelectedId } from '../../../reducers/selected.js'
import classes from './styles/FilterBadge.module.css'

const FilterBadge = ({ dashboardId, filter, openFilterModal, onRemove }) => {
    const { isConnected: online } = useDhis2ConnectionStatus()
    const { isCached } = useCacheableSection(dashboardId)

    const notAllowed = !isCached && !online

    const filterText = `${filter.name}: ${
        filter.values.length > 1
            ? i18n.t('{{count}} selected', {
                  count: filter.values.length,
              })
            : filter.values[0].name
    }`

    return (
        <div className={classes.container} data-test="dashboard-filter-badge">
            <button
                className={cx(classes.button, classes.filterButton)}
                onClick={() =>
                    openFilterModal({
                        id: filter.id,
                        name: filter.name,
                    })
                }
            >
                {filterText}
            </button>
            <Tooltip
                content={i18n.t('Cannot remove filters while offline')}
                openDelay={200}
                closeDelay={100}
                className={classes.tooltip}
            >
                {({ onFocus, onBlur, onMouseOver, onMouseOut, ref }) => (
                    <button
                        className={cx(classes.button, classes.removeButton, {
                            [classes.notAllowed]: notAllowed,
                        })}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onMouseOver={() => notAllowed && onMouseOver()}
                        onMouseOut={() => notAllowed && onMouseOut()}
                        ref={ref}
                        disabled={notAllowed}
                        onClick={() => onRemove(filter.id)}
                    >
                        <IconCross16 />
                    </button>
                )}
            </Tooltip>
        </div>
    )
}

FilterBadge.propTypes = {
    dashboardId: PropTypes.string.isRequired,
    filter: PropTypes.object.isRequired,
    openFilterModal: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    dashboardId: sGetSelectedId(state),
})

export default connect(mapStateToProps, {
    openFilterModal: acSetActiveModalDimension,
})(FilterBadge)
