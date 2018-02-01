import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import InputField from './InputField';
import { colors } from '../../../colors';
import { formatDate, sortByDate } from '../../../util';
import { getPluginCredentials } from '../Item';

import {
    tLikeInterpretation,
    tUnlikeInterpretation,
    tAddInterpretationComment,
    tDeleteInterpretationComment,
    tDeleteInterpretation,
} from './actions';

import './Interpretation.css';

const actionButtonClass = 'interpretation-action-button';
const style = {
    author: {
        color: colors.darkGrey,
        fontSize: '13px',
        fontWeight: '500',
        lineHeight: '15px',
    },
    comment: {
        paddingRight: '6px',
        paddingTop: '7px',
    },
    created: {
        color: colors.mediumGrey,
        float: 'right',
        fontSize: '12px',
        lineHeight: '14px',
        textAlign: 'right',
    },
    deleteButton: {
        color: colors.red,
    },
    icon: {
        height: '12px',
        marginBottom: '-2px',
        paddingRight: '3px',
        width: '12px',
    },
    likes: {
        margin: '0 8px',
        color: colors.darkGrey,
        fontSize: '12px',
        lineHeight: '14px',
    },
    line: {
        backgroundColor: `${colors.lightGrey}`,
        border: 'none',
        height: '1px',
        margin: '-1px 0px 0px',
    },
    list: {
        borderLeft: `4px solid ${colors.lightGrey}`,
        borderTop: `1px solid ${colors.lightGrey}`,
        listStyleType: 'none',
        marginTop: '10px',
        paddingLeft: '20px',
    },
    text: {
        color: colors.darkGrey,
        fontSize: '13px',
        lineHeight: '17px',
    },
};

const deleteButton = action => {
    const iconStyle = Object.assign({}, style.icon, { fill: colors.red });

    return (
        <button
            className={actionButtonClass}
            style={style.deleteButton}
            onClick={action}
        >
            <SvgIcon style={iconStyle} icon="Delete" />
            Delete
        </button>
    );
};

class Interpretation extends Component {
    state = {
        showCommentField: false,
        uiLocale: '',
        visualizerHref: '',
    };

    componentDidMount() {
        this.context.d2.currentUser.userSettings
            .get('keyUiLocale')
            .then(uiLocale => this.setState({ uiLocale }));

        const baseUrl = getPluginCredentials(this.context.d2).baseUrl;
        const visualizerHref = `${baseUrl}/dhis-web-visualizer/index.html?id=${
            this.props.objectId
        }&interpretationid=${this.props.item.id}`;
        this.setState({ visualizerHref });
    }

    userLikesInterpretation = () => {
        return this.props.item.likedBy.find(liker =>
            this.userIsOwner(liker.id)
        );
    };

    toggleInterpretationLike = () => {
        const { id } = this.props.item;

        this.userLikesInterpretation()
            ? this.props.unlikeInterpretation(id)
            : this.props.likeInterpretation(id);
    };

    showCommentField = () => {
        this.setState({ showCommentField: true });
    };

    postComment = text => {
        const { id } = this.props.item;
        this.props.addComment({ id, text });
        this.setState({ showCommentField: false });
    };

    deleteComment = commentId => {
        const { id } = this.props.item;
        this.props.deleteComment({ id, commentId });
    };

    deleteInterpretation = () => {
        const data = {
            id: this.props.item.id,
            objectId: this.props.objectId,
            objectType: this.props.objectType,
        };

        this.props.deleteInterpretation(data);
    };

    userIsOwner = id => id === this.context.d2.currentUser.id;

    renderActions() {
        const item = this.props.item;
        const likes = item.likedBy.length === 1 ? 'like' : 'likes';
        const userOwnsInterpretation = this.userIsOwner(item.user.id);

        const thumbsUpIcon = this.userLikesInterpretation()
            ? Object.assign({}, style.icon, { fill: colors.accentLightGreen })
            : style.icon;
        const likeText = this.userLikesInterpretation()
            ? 'You like this'
            : 'Like';

        return (
            <div>
                <a href={this.state.visualizerHref} style={{ height: 16 }}>
                    <SvgIcon icon="Launch" style={style.icon} />
                    View in Visualizer
                </a>
                <button
                    className={actionButtonClass}
                    onClick={this.showCommentField}
                >
                    <SvgIcon style={style.icon} icon="Reply" />
                    Reply
                </button>
                <button
                    className={actionButtonClass}
                    onClick={this.toggleInterpretationLike}
                >
                    <SvgIcon style={thumbsUpIcon} icon="ThumbUp" />
                    {likeText}
                </button>
                <span style={style.likes}>
                    {this.props.item.likedBy.length} {likes}
                </span>
                {userOwnsInterpretation
                    ? deleteButton(this.deleteInterpretation)
                    : null}
            </div>
        );
    }

    renderComments() {
        if (!this.props.item.comments.length) {
            return null;
        }

        const lineStyle = Object.assign({}, style.line, {
            marginTop: '5px',
        });

        const comments = sortByDate(this.props.item.comments, 'created').map(
            comment => (
                <li style={style.comment} key={comment.id}>
                    <div>
                        <span style={style.author}>
                            {comment.user.displayName}
                        </span>
                        <span style={style.created}>
                            {formatDate(comment.created, this.state.uiLocale)}
                        </span>
                    </div>
                    <p style={style.text}>{comment.text}</p>
                    {this.userIsOwner(comment.user.id)
                        ? deleteButton(() => this.deleteComment(comment.id))
                        : null}
                    <hr style={lineStyle} />
                </li>
            )
        );

        return <ul style={style.list}>{comments}</ul>;
    }

    render() {
        const interpretationBody = item => {
            return (
                <div>
                    <div>
                        <span style={style.author}>
                            {item.user.displayName}
                        </span>
                        <span style={style.created}>
                            {formatDate(item.created, this.state.uiLocale)}
                        </span>
                    </div>
                    <p style={style.text}>{item.text}</p>
                </div>
            );
        };

        return (
            <div>
                {interpretationBody(this.props.item)}
                {this.renderActions()}
                {this.renderComments()}
                {this.state.showCommentField ? (
                    <InputField
                        placeholder="Write your reply"
                        onPost={this.postComment}
                        postText="Reply"
                    />
                ) : null}
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        likeInterpretation: data => dispatch(tLikeInterpretation(data)),
        unlikeInterpretation: data => dispatch(tUnlikeInterpretation(data)),
        addComment: data => dispatch(tAddInterpretationComment(data)),
        deleteComment: data => dispatch(tDeleteInterpretationComment(data)),
        deleteInterpretation: data => dispatch(tDeleteInterpretation(data)),
    };
};

Interpretation.contextTypes = {
    d2: PropTypes.object,
};

const InterpretationContainer = connect(null, mapDispatchToProps)(
    Interpretation
);

export default InterpretationContainer;
