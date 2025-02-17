import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { IconCross16, Tooltip } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { acSetActiveModalDimension } from '../../../actions/activeModalDimension.js'
import { useWindowDimensions } from '../../../components/WindowDimensionsProvider.js'
import { sGetSelectedId } from '../../../reducers/selected.js'
import classes from './styles/FilterBadge.module.css'

const getFilterValuesText = (values) =>
    values.length === 1
        ? values[0].name
        : i18n.t('{{count}} selected', {
              count: values.length,
              defaultValue: '{{count}} selected',
              defaultValue_plural: '{{count}} selected',
          })

const EditFilterButton = ({ tooltipContent, filter, openFilterModal }) => {
    const buttonText = `${filter.name}: ${getFilterValuesText(filter.values)}`

    if (!tooltipContent) {
        return (
            <button
                data-test="filter-badge-button"
                className={cx(classes.button, classes.filterButton)}
                onClick={() =>
                    openFilterModal({
                        id: filter.id,
                        name: filter.name,
                    })
                }
            >
                {buttonText}
            </button>
        )
    }

    return (
        <Tooltip
            content={tooltipContent}
            openDelay={200}
            closeDelay={100}
            className={classes.tooltip}
        >
            {(props) => (
                <button
                    disabled
                    data-test="filter-badge-button"
                    className={cx(classes.button, classes.filterButton)}
                    {...props}
                >
                    {buttonText}
                </button>
            )}
        </Tooltip>
    )
}
EditFilterButton.propTypes = {
    filter: PropTypes.object,
    openFilterModal: PropTypes.func,
    tooltipContent: PropTypes.string,
}

const FilterBadge = ({ filter, openFilterModal, onRemove }) => {
    const { isConnected } = useDhis2ConnectionStatus()
    const { width } = useWindowDimensions()
    const isEditDisabled = !isConnected || width <= 480
    const tooltipContent = !isConnected
        ? i18n.t('Cannot edit filters while offline')
        : i18n.t('Cannot edit filters on a small screen')

    return (
        <div className={classes.container} data-test="dashboard-filter-badge">
            <EditFilterButton
                filter={filter}
                openFilterModal={openFilterModal}
                tooltipContent={isEditDisabled ? tooltipContent : null}
            />
            {isConnected && (
                <button
                    data-test="filter-badge-clear-button"
                    className={cx(classes.button, classes.removeButton)}
                    disabled={!isConnected}
                    onClick={() => onRemove(filter.id)}
                >
                    <IconCross16 />
                </button>
            )}
        </div>
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
