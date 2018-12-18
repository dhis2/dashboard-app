import getMuiTheme from 'material-ui/styles/getMuiTheme';

import { colors } from './colors';

export const muiTheme = () => {
    const raisedButton = {
        primaryColor: colors.royalBlue,
        disabledColor: colors.paleBlue,
        disabledTextColor: colors.lightMediumGrey,
    };

    const theme = getMuiTheme({ raisedButton });

    return theme;
};
