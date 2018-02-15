import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { colors } from './colors';

export const muiTheme = () => {
    const palette = {
        // primary1Color: colors.royalBlue,
        // primary2Color: cyan700,
        // primary3Color: grey400,
        // accent1Color: colors.accentLightGreen,
        // accent2Color: colors.royal,
        // accent3Color: grey500,
        // textColor: darkBlack,
        // alternateTextColor: white,
        // canvasColor: white,
        // borderColor: grey300,
        // disabledColor: fade(darkBlack, 0.3),
        // pickerHeaderColor: cyan500,
        // clockCircleColor: fade(darkBlack, 0.07),
        // shadowColor: fullBlack,
    };

    const raisedButton = {
        // color: colors.white,
        // textColor: colors.white,
        primaryColor: colors.royalBlue, //changes the button background
        // primaryTextColor: colors.white,
        // secondaryColor: palette.accent1Color,
        // secondaryTextColor: colors.white,
        // disabledColor: darken(palette.alternateTextColor, 0.1),
        // disabledTextColor: fade(palette.textColor, 0.3),
        // fontSize: typography.fontStyleButtonFontSize,
        // fontWeight: typography.fontWeightMedium,
    };

    const theme = getMuiTheme({ palette, raisedButton });
    console.log('theme is', theme);

    return theme;
};
