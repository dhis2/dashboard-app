import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18n from 'd2-i18n';

import { sGetMessagesRoot } from '../../../reducers/messages';
import { formatDate } from '../../../modules/util';
import { colors } from '../../../modules/colors';
import ItemHeader from '../ItemHeader';
import Line from '../../../widgets/Line';

import './MessagesItem.css';

const PRIVATE = 'PRIVATE';

const messageTypes = {
    [PRIVATE]: 'Private',
    VALIDATION_RESULT: 'Validation',
    TICKET: 'Ticket',
    SYSTEM: 'System',
};

const style = {
    list: {
        listStyleType: 'none',
        paddingLeft: '0px',
    },
    seeAll: {
        textAlign: 'center',
        fontSize: '13px',
        marginBottom: '5px',
    },
    sender: {
        fontSize: '13px',
        lineHeight: '15px',
        margin: 0,
        color: colors.darkGrey,
    },
    snippet: {
        color: colors.darkGrey,
        fontSize: '13px',
        lineHeight: '15px',
        maxHeight: '30px',
        overflow: 'hidden',
    },
};

class MessagesItem extends Component {
    state = {
        uiLocale: '',
    };

    async componentDidMount() {
        const uiLocale = await this.context.d2.currentUser.userSettings.get(
            'keyUiLocale'
        );

        this.setState({ uiLocale });
    }

    getMessageHref = msg => {
        const msgIdentifier = msg ? `#/${msg.messageType}/${msg.id}` : '';
        return `${this.context.baseUrl}/dhis-web-messaging/${msgIdentifier}`;
    };

    getMessageSender = msg => {
        const latestMsg = msg.messages.slice(-1)[0];
        return latestMsg.sender ? latestMsg.sender.displayName : '';
    };

    getMessageItems = () => {
        const editClass = !this.props.editMode ? 'view' : null;

        return this.props.messages.map(msg => {
            const redirectToMsg = () => {
                if (!this.props.editMode) {
                    document.location.href = this.getMessageHref(msg);
                }
            };

            const sender =
                msg.messageType === PRIVATE
                    ? this.getMessageSender(msg)
                    : messageTypes[msg.messageType];

            const readClass = !msg.read ? 'unread' : null;
            const latestMsg = msg.messages.slice(-1)[0];
            const msgDate = latestMsg.lastUpdated;

            return (
                <li
                    className={`message-item ${editClass}`}
                    key={msg.id}
                    onClick={redirectToMsg}
                >
                    <p className={`message-title ${readClass}`}>
                        {msg.displayName} ({msg.messageCount})
                    </p>
                    <p style={style.sender}>
                        {sender} - {formatDate(msgDate, this.state.uiLocale)}
                    </p>
                    <p style={style.snippet}>{latestMsg.text}</p>
                </li>
            );
        });
    };

    render() {
        return (
            <Fragment>
                <ItemHeader title={i18n.t('Messages')} />
                <Line />
                {this.props.messages.length > 0 && (
                    <div className="dashboard-item-content">
                        <ul style={style.list}>{this.getMessageItems()}</ul>
                        <div style={style.seeAll}>
                            <a href={this.getMessageHref()}>
                                {i18n.t('See all messages')}
                            </a>
                        </div>
                    </div>
                )}
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
        messages: Object.values(sGetMessagesRoot(state)),
    };
};

const MessagesContainer = connect(
    mapStateToProps,
    null
)(MessagesItem);

export default MessagesContainer;
