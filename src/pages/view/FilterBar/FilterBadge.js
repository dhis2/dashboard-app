import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { IconCross16, Tooltip } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { acSetActiveModalDimension } from '../../../actions/activeModalDimension.js'
import { sGetSelectedId } from '../../../reducers/selected.js'
import classes from './styles/FilterBadge.module.css'

const getFilterValuesText = (values) =>
    values.length === 1
        ? values[0].name
        : i18n.t('{{count}} selected', { count: values.length })

const FilterBadge = ({ filter, openFilterModal, onRemove }) => {
    const { isConnected } = useDhis2ConnectionStatus()

    return (
        <Tooltip
            content={i18n.t('Cannot edit filters while offline')}
            openDelay={200}
            closeDelay={100}
            className={classes.tooltip}
        >
            {({ onFocus, onBlur, onMouseOver, onMouseOut, ref }) => (
                <div
                    className={classes.container}
                    data-test="dashboard-filter-badge"
                    onFocus={() => !isConnected && onFocus()}
                    onBlur={() => !isConnected && onBlur()}
                    onMouseOver={() => !isConnected && onMouseOver()}
                    onMouseOut={() => !isConnected && onMouseOut()}
                    ref={ref}
                >
                    <button
                        data-test="filter-badge-button"
                        className={cx(classes.button, classes.filterButton)}
                        disabled={!isConnected}
                        onClick={() =>
                            openFilterModal({
                                id: filter.id,
                                name: filter.name,
                            })
                        }
                    >
                        {filter.name}: {getFilterValuesText(filter.values)}
                    </button>
                    <button
                        data-test="filter-badge-clear-button"
                        className={cx(classes.button, classes.removeButton)}
                        disabled={!isConnected}
                        onClick={() => onRemove(filter.id)}
                    >
                        <IconCross16 />
                    </button>
                </div>
            )}
        </Tooltip>
    )
}

FilterBadge.propTypes = {
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
