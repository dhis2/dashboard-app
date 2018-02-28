import stubContext from 'react-stub-context';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {
    blue500,
    blue700,
    lightBlack,
    grey300,
    grey500,
    white,
    darkBlack,
} from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';
import Spacing from 'material-ui/styles/spacing';

/* istanbul ignore next */
export const appTheme = {
    spacing: Spacing,
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: blue500,
        primary2Color: blue700,
        primary3Color: lightBlack,
        accent1Color: '#276696',
        accent2Color: '#E9E9E9',
        accent3Color: grey500,
        textColor: darkBlack,
        alternateTextColor: white,
        canvasColor: white,
        borderColor: grey300,
        disabledColor: fade(darkBlack, 0.3),
    },
};

/* istanbul ignore next */
export function getStubContext() {
    const injectedTheme = Object.assign({}, getMuiTheme(appTheme), appTheme);
    return {
        muiTheme: injectedTheme,
        d2: {
            i18n: {
                getTranslation(key) {
                    return `${key}_translated`;
                },
            },
            Api: {
                getApi: jest
                    .fn()
                    .mockReturnValue({ baseUrl: 'http://localhost:8080' }),
            },
            system: {
                settings: {
                    all: jest.fn().mockReturnValue(Promise.resolve({})),
                },
            },
            currentUser: {
                firstName: 'Mark',
                surname: 'Polak',
                userSettings: {
                    keyStyle: 'vietnam/vietnam.css',
                },
            },
        },
    };
}

/* istanbul ignore next */
function injectTheme(Component, theme) {
    const injectedTheme = theme || getMuiTheme(appTheme);
    return stubContext(Component, {
        muiTheme: injectedTheme,
        d2: {
            i18n: {
                getTranslation(key) {
                    return `${key}_translated`;
                },
            },
            Api: {
                getApi: stub().returns({ baseUrl: 'http://localhost:8080' }),
            },
            system: {
                settings: {
                    all: stub().returns(Promise.resolve({})),
                },
            },
        },
    });
}

export default injectTheme;
