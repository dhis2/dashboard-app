import React from 'react';
import AddIcon from '@material-ui/icons/AddCircle';
import { colors } from '../modules/colors';

const AddDashboardButton = () => {
    return (
        <React.Fragment>
            <button className="add-dashboard-button">
                <AddIcon className="add-dashboard-icon" />
            </button>

            <style jsx>{`
                .add-dashboard-button {
                    width: 36px;
                    height: 36px;
                    padding: 0;
                    background-color: transparent;
                    border: none;
                    outline: none;
                    box-shadow: none;
                }

                .add-dashboard-button:focus {
                    outline: none;
                }

                .add-dashboard-icon {
                    fill: ${colors.mediumGreen};
                    width: 1.3em;
                    height: 1.3em;
                    cursor: pointer;
                }
            `}</style>
        </React.Fragment>
    );
};

export default AddDashboardButton;
