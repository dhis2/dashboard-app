export const EDIT = 'edit'
export const NEW = 'new'
export const VIEW = 'view'
export const PRINT = 'print'

export const isEditMode = mode => [EDIT, NEW].includes(mode)
export const isPrintMode = mode => [PRINT].includes(mode)
export const isViewMode = mode => mode === VIEW
