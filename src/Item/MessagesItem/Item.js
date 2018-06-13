import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18n from 'd2-i18n';

import ItemHeader from '../ItemHeader';
import { fromMessages } from '../../reducers';
import Line from '../../widgets/Line';
import { colors } from '../../colors';
import { formatDate, sortByDate } from '../../util';

import './MessagesItem.css';

const style = {
    activeButton: {
        fontWeight: 'bold',
        textDecoration: 'underline',
    },
    author: {
        color: colors.darkGrey,
        fontSize: '12px',
        lineHeight: '14px',
    },
    button: {
        background: 'transparent',
        border: 'none',
        color: colors.darkGrey,
        cursor: 'pointer',
        font: 'inherit',
        fontSize: '12px',
        height: '14px',
        lineJeight: '14px',
        marginRight: '10px',
        padding: '0 !important',
    },
    date: {
        color: colors.mediumGrey,
        float: 'right',
        fontSize: '12px',
        lineHeight: '14px',
        textAlign: 'right',
    },
    list: {
        listStyleType: 'none',
        paddingLeft: '0px',
    },
    listitem: {
        borderBottom: `1px solid ${colors.lightGrey}`,
        paddingBottom: '10px',
        margin: '0 5px 10px 5px',
    },
    title: {
        color: colors.darkGrey,
        fontSize: '13px',
        lineHeight: '17px',
    },
};

class MessagesItem extends Component {
    state = {
        uiLocale: '',
        filter: 'all',
    };

    async componentDidMount() {
        const uiLocale = await this.context.d2.currentUser.userSettings.get(
            'keyUiLocale'
        );

        this.setState({ uiLocale });
    }

    messageHref = msg =>
        this.props.editMode
            ? '#'
            : `${this.context.baseUrl}/dhis-web-messaging/#/${
                  msg.messageType
              }/${msg.id}`;

    filterAll = () => {
        this.setState({ filter: 'all' });
    };

    filterUnread = () => {
        this.setState({ filter: 'unread' });
    };

    activeButtonStyle = Object.assign({}, style.button, style.activeButton);

    getActionButtonStyle = buttonName =>
        buttonName === this.state.filter
            ? this.activeButtonStyle
            : style.button;

    getActionButtons = () =>
        !this.props.editMode ? (
            <Fragment>
                <button
                    className="messages-action-button"
                    type="button"
                    style={this.getActionButtonStyle('all')}
                    onClick={this.filterAll}
                >
                    {i18n.t('All')}
                </button>
                <button
                    className="messages-action-button"
                    type="button"
                    style={this.getActionButtonStyle('unread')}
                    onClick={this.filterUnread}
                >
                    {i18n.t('Unread')}
                </button>
            </Fragment>
        ) : null;

    getMessageItems = () => {
        const { messages } = this.props;
        const filteredMessages = messages.filter(msg => {
            return this.state.filter === 'unread' ? msg.read === false : true;
        });

        return sortByDate(filteredMessages, 'lastUpdated', false).map(msg => {
            const listItemStyle = Object.assign({}, style.listitem, {
                fontWeight: msg.read ? 'normal' : 'bold',
            });
            return (
                <li style={listItemStyle} key={msg.id}>
                    <div>
                        <div style={style.author}>
                            {msg.userFirstname} {msg.userSurname} ({
                                msg.messageCount
                            })
                        </div>
                        <div style={style.date}>
                            {formatDate(msg.lastUpdated, this.state.uiLocale)}
                        </div>
                        <a href={this.messageHref(msg)}>
                            <span style={style.title}>{msg.displayName}</span>
                        </a>
                    </div>
                </li>
            );
        });
    };

    render() {
        const actionButtons = this.getActionButtons();
        const messageItems = this.getMessageItems();

        return (
            <Fragment>
                <ItemHeader
                    title={i18n.t('Messages')}
                    actionButtons={actionButtons}
                />
                <Line />
                <div className="dashboard-item-content">
                    <ul style={style.list}>{messageItems}</ul>
                </div>
            </Fragment>
        );
    }
}

MessagesItem.contextTypes = {
    d2: PropTypes.object,
    baseUrl: PropTypes.string,
};

const mapStateToProps = state => {
    return {
        messages: Object.values(fromMessages.sGetMessages(state)),
    };
};

const MessagesContainer = connect(mapStateToProps, null)(MessagesItem);

export default MessagesContainer;
