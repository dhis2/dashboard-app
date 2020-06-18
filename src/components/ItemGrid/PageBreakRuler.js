import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sGetEditDashboardItems } from '../../reducers/editDashboard';
import { acAddDashboardItem } from '../../actions/editDashboard';
import { getOriginalHeight, getGridYFromPixels } from '../ItemGrid/gridUtil';
import { PAGEBREAK } from '../../modules/itemTypes';

const PageBreakRuler = ({ dashboardItems, addDashboardItem }) => {
    // for A4 landscape (297x210mm)
    // 794 px = (21cm / 2.54) * 96 pixels/inch
    // then subtract the top and bottom margins
    const margin = 10 * 2;
    const pageHeight = 794 - margin;

    const lastItem = dashboardItems[dashboardItems.length - 1];
    const h = lastItem.y + lastItem.h;
    const gridHeight = getOriginalHeight({ h }).originalHeight;

    const numPages = Math.ceil(gridHeight / pageHeight);
    // console.log('pages', numPages);

    const divClicked = ev => {
        console.log('ev', ev);
        console.log('ev', ev.pageY, ev.screenY, ev.clientY);

        const y = getGridYFromPixels(ev.pageY);
        console.log('y', y);
        addDashboardItem({ type: PAGEBREAK, yPos: y });
    };

    const pageBreaks = Array(numPages)
        .fill(null)
        .map((u, i) => {
            return (
                <div
                    key={`${i}-pagebreak`}
                    onClick={divClicked}
                    style={{
                        position: 'absolute',
                        top: pageHeight * (i + 1),
                        width: '100%',
                        height: '5px',
                        backgroundColor: 'green',
                        zIndex: '10000',
                    }}
                />
            );
        });

    return <>{pageBreaks}</>;
};

PageBreakRuler.propTypes = {
    dashboardItems: PropTypes.array,
};

const mapStateToProps = state => {
    return { dashboardItems: sGetEditDashboardItems(state) };
};

const mapDispatchToProps = { addDashboardItem: acAddDashboardItem };

export default connect(mapStateToProps, mapDispatchToProps)(PageBreakRuler);
