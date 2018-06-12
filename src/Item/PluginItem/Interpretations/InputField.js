import React, { Component } from 'react';
import TextField from 'd2-ui/lib/text-field/TextField';
import Button from 'd2-ui/lib/button/Button';
import i18n from 'd2-i18n';
import { colors } from '../../../colors';

const style = {
    button: {
        height: '30px',
        width: '16.84px',
        color: colors.charcoalGrey,
        fontFamily: 'inherit',
        fontSize: '13px',
        lineHeight: '15px',
        //display: 'inherit',
    },
    container: {
        marginBottom: '5px',
    },
    text: {
        fontSize: '14px',
        fontStretch: 'normal',
    },
    textField: {
        width: '80%',
        display: 'inline-block',
    },
};

class InputField extends Component {
    state = {
        newText:
            this.props.postText === i18n.t('Update')
                ? this.props.placeholder
                : '',
    };

    updateNewText = newText => {
        this.setState({ newText });
    };

    onClick = () => {
        this.props.onSubmit(this.state.newText);
        this.setState({ newText: '' });
    };

    render() {
        return (
            <div style={style.container}>
                <div style={style.textField}>
                    <TextField
                        multiline
                        value={this.state.newText}
                        rows={1}
                        rowsMax={8}
                        fullWidth
                        style={style.text}
                        placeholder={this.props.placeholder}
                        onChange={this.updateNewText}
                    />
                </div>
                <Button
                    disabled={!this.state.newText.length}
                    style={style.button}
                    onClick={this.onClick}
                >
                    {this.props.postText}
                </Button>
            </div>
        );
    }
}

export default InputField;
