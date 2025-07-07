import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Input, Tooltip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/ItemSearchField.module.css'

const ItemSearchField = (props) => {
    const { isConnected: online } = useDhis2ConnectionStatus()

    const getInput = () => (
        // autoComplete not supported in ui@6, remove this form after upgrade
        <form autoComplete="off" onSubmit={Function.prototype}>
            <Input
                name="Dashboard item search"
                label={i18n.t('Search for items to add to this dashboard')}
                type="text"
                onChange={props.onChange}
                onFocus={props.onFocus}
                value={props.value}
                dataTest="item-search"
                dense
                disabled={!online}
                placeholder={i18n.t(
                    'Search for visualizations, reports and more'
                )}
            />
        </form>
    )

    return (
        <>
            <div className={classes.label}>
                Search for items to add to this dashboard
            </div>
            {online ? (
                getInput()
            ) : (
                <Tooltip
                    content={i18n.t(
                        'Cannot search for dashboard items while offline'
                    )}
                    openDelay={200}
                    closeDelay={100}
                >
                    {getInput()}
                </Tooltip>
            )}
        </>
    )
}

ItemSearchField.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
}

export default ItemSearchField
