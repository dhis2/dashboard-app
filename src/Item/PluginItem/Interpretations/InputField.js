import React, { Component } from 'react';
import TextField from 'd2-ui/lib/text-field/TextField';
import Button from 'd2-ui/lib/button/Button';
import { colors } from '../../../colors';

const style = {
    button: {
        height: '30px',
        width: '16.84px',
        top: '5px',
        left: '10px',
        color: colors.charcoalGrey,
        fontFamily: 'inherit',
        fontSize: '13px',
        lineHeight: '15px',
    },
    container: {
        marginBottom: '5px',
        width: '100%',
        display: 'inline-flex',
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
        newText: this.props.text || '',
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
