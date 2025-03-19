export const setHeaderbarVisible = (show) => {
    // Header in the current iframe
    const iframeHeader = document.getElementsByTagName('header')[0]

    // Header in the top-level document
    const globalShellHeader = window.top.document.querySelector(
        '.global-shell-header'
    )

    if (show) {
        if (globalShellHeader) {
            globalShellHeader.style.display = 'block'
        } else {
            iframeHeader?.classList.remove('hidden')
        }
    } else {
        if (globalShellHeader) {
            globalShellHeader.style.display = 'none'
        } else {
            iframeHeader?.classList.add('hidden')
        }
    }
}
