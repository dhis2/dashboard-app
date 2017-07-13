import isFunction from 'd2-utilizr/lib/isFunction';

const $ = global.jQuery;

export class Grid {
    constructor() {
        let _grid;
        this.set = (grid) => _grid = grid;
        this.get = () => _grid;
    }
};

const configureGrid = () => {
    const el = $('.grid-stack');

    const itemResize = (e) => {
        setTimeout(() => {
            const el = document.getElementById('plugin-' + e.target.dataset.gsId);

            if (el && isFunction(el.setViewportSize)) {
                el.setViewportSize($(e.target).width() - 15, $(e.target).height() - 30);
            }
        }, 10);
    };

    const options = {
        verticalMargin: 10,
        cellHeight: 20,
        width: 50
    };

    el.gridstack(options);

    el.on('resizestop', itemResize);

    return el.data('gridstack');
};

export default configureGrid;