export const DASHBOARD_MODE_EDIT = 'edit'
export const DASHBOARD_MODE_NEW = 'new'
export const DASHBOARD_MODE_VIEW = 'view'
export const DASHBOARD_MODE_PRINT_LAYOUT = 'printLayout'
export const DASHBOARD_MODE_PRINT_OIPP = 'printOipp'

export const isViewMode = mode => mode === DASHBOARD_MODE_VIEW
export const isEditMode = mode =>
    [DASHBOARD_MODE_NEW, DASHBOARD_MODE_EDIT].includes(mode)

export const isPrintLayoutMode = mode => mode === DASHBOARD_MODE_PRINT_LAYOUT
export const isPrintOippMode = mode => mode === DASHBOARD_MODE_PRINT_OIPP
export const isPrintMode = mode =>
    [DASHBOARD_MODE_PRINT_LAYOUT, DASHBOARD_MODE_PRINT_OIPP].includes(mode)
