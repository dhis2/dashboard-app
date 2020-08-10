export const EDIT = 'edit'
export const NEW = 'new'
export const VIEW = 'view'
export const PRINT = 'print'
export const PRINT_LAYOUT = 'print-layout'

export const isEditMode = mode => [EDIT, NEW].includes(mode)
export const isPrintMode = mode => [PRINT, PRINT_LAYOUT].includes(mode)
export const isViewMode = mode => mode === VIEW
