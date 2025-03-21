export const setHeaderbarVisible = (show) => {
    // Header in the current iframe
    const iframeHeader = document.getElementsByTagName('header')[0]

    // Header provided by the global shell
    const globalShellHeader = window.top.document.querySelector(
        '.global-shell-header'
    )

    if (show) {
        globalShellHeader
            ? (globalShellHeader.style.display = 'block')
            : iframeHeader?.classList.remove('hidden')
    } else {
        globalShellHeader
            ? (globalShellHeader.style.display = 'none')
            : iframeHeader?.classList.add('hidden')
    }
}
